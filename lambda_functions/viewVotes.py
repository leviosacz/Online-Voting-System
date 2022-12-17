import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, content):
    '''
    {
     sponsor:
     }

    '''
    response = {'statusCode': 200, "body":[]}
    dynamodb = boto3.resource('dynamodb', region_name=('us-west-2'))
    votesList = dynamodb.Table('votesList')
    
    # sacn voteOptionList
    if event["sponsor"] == 'all':
        item = votesList.scan(
            )
    else:
        item = votesList.scan(
            FilterExpression= Key('sponsor').eq(event["sponsor"])
            )
    
    response["body"] = item["Items"]
    return response