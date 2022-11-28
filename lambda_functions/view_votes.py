# This fuction returns all votes in the database

import json
import boto3
from json import dumps
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
    data = table.scan()
    response = {
        'statusCode': 200,
        'body': json.dumps(data['Items'], cls=DecimalEncoder)
    }
    return response
