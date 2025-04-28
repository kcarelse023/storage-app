import json
import os
from datetime import datetime
import boto3
from decimal import Decimal

# Prepare DynamoDB client
UNITS_TABLE = os.getenv('UNITS_TABLE', None)
dynamodb = boto3.resource('dynamodb')
ddbTable = dynamodb.Table(UNITS_TABLE)

# Utility function to handle Decimal
def convert_decimal(obj):
    if isinstance(obj, list):
        return [convert_decimal(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

# Functions for CRUD operations
def get_units():
    response = ddbTable.scan(Select='ALL_ATTRIBUTES')
    return response['Items']

def get_unit_by_id(unit_id):
    response = ddbTable.get_item(Key={'unitId': unit_id})
    return response.get('Item', {})

def delete_unit(unit_id):
    ddbTable.delete_item(Key={'unitId': unit_id})
    return {}

def create_unit(unit_attributes, request_body):
    
    discounts = request_body.get('discounts', [])
    if discounts:

        processed_discounts = [
            {
                'type': discount.get('type'),
                'amount': discount.get('amount'),
                'description': discount.get('description')
            }
            for discount in discounts
        ]
    else:
        processed_discounts = []
    
    unit_data = {
        'unitId': unit_attributes.get('unitId'),
        'facilityId': unit_attributes.get('facilityId'),
        'size' : unit_attributes.get('size'),
        'status' : unit_attributes.get('status'),
        'price' : unit_attributes.get('price'),
        'discounts': processed_discounts,
        
        **request_body
    }
    ddbTable.put_item(Item=unit_data)
    return unit_data

def update_unit(unit_id, request_body):
    #Get the existing unit data
    existing_unit_data = get_unit_by_id(unit_id)
    
    if not existing_unit_data:
        raise ValueError(f"Unit with ID {unit_id} does not exist.")
    
    #Merge existing data with new fields from request_body
    unit_attributes = {
        **existing_unit_data,  # Start with the current data
        **request_body         # Overwrite with any new values
    }
    
    #Write the updated item back to the table
    ddbTable.put_item(Item=unit_attributes)
    
    return unit_attributes


def handle_post_confirmation(unit_attributes):
    unit_data = {
        'unitId': unit_attributes.get('unitId'),
        'bookedUserId' : unit_attributes.get('bookedUserId'),
        'userBillingOption' : unit_attributes.get('userBillingOption'),
        'sharedAccess': unit_attributes.get('sharedAccess'),
        'startDate': datetime.now().isoformat(),
        'endDate':datetime.now().isoformat(),
        
    }
    ddbTable.put_item(Item=unit_data)
    return unit_data

# Map routes to functions
operations = {
    'GET /units': lambda event: get_units(),
    'GET /units/{unitId}': lambda event: get_unit_by_id(event['pathParameters']['unitId']),
    'DELETE /units/{unitId}': lambda event: delete_unit(event['pathParameters']['unitId']),
    'POST /units': lambda event: create_unit(
        event['request']['unitAttributes'], json.loads(event['body'])
    ),
    'PUT /units/{unitId}': lambda event: update_unit(
        event['pathParameters']['unitId'], json.loads(event['body'])
    ),
    'PostConfirmation_ConfirmSignUp': lambda event: handle_post_confirmation(
        event['request']['unitAttributes']
    ),
}

def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        "Access-Control-Expose-Headers": "Authorization, X-Custom-Header",
        "Access-Control-Allow-Credentials": "true"


    
     
    }

    try:
        # Handle PostConfirmation trigger
        if event.get('triggerSource') == 'PostConfirmation_ConfirmSignUp':
            operations[event['triggerSource']](event)
            return event
        else:
            # Handle API Gateway routes
            route_key = f"{event['httpMethod']} {event['resource']}"
            if route_key in operations:
                response_body = operations[route_key](event)
                response_body = convert_decimal(response_body)
                status_code = 200
            else:
                raise ValueError(f"Unsupported route: {route_key}")
    except Exception as err:
        response_body = {'Error': str(err)}
        status_code = 400
        print(str(err))

    return {
        'statusCode': status_code,
        'body': json.dumps(convert_decimal(response_body)),
        'headers': headers
    }
