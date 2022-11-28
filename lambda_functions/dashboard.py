# This fuction receives username and returns all votes created by the user

import json
import boto3
from boto3.dynamodb.conditions import Attr
from json import dumps, loads
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('votes')
# the name of table 1, with Number, title, sponsor, Date and voters in it

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)

def lambda_handler(event, context):
    body = json.loads(event['body'])
    username = body['username']
    data = table.scan(
        FilterExpression = Attr('sponsor').eq(username)
    )
    response = {
        'statusCode': 200,
        'body': json.dumps(data['Items'], cls=DecimalEncoder)
    }
    return response
