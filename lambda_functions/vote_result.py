# This fuction receives vote number and returns all options and corresponding voter counts

import json
import boto3
from json import dumps, loads
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('votes_titles')
# the name of table 2, with Number, options and voters in it

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)

def lambda_handler(event, context):
    body = json.loads(event['body'])
    Number = int(body['Number'])
    data = table.get_item(Key={'Number': Number}) # use Number as the key
    response = {
        'statusCode': 200,
        'body': json.dumps(data['Item'], cls=DecimalEncoder)
    }
    return response
