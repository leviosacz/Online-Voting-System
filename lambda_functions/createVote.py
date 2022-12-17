#import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, content):
    '''
    request form
    {
     type:createVote
     vote_title:
     date:
     sponsor: user
     pic:
     options:[ , ,]
     }
    
    '''
    dynamodb = boto3.resource('dynamodb', region_name=('us-west-2'))
    response = {'statusCode': 200, 'body': True}
    votesList = dynamodb.Table('votesList')
    voteOptionList = dynamodb.Table('voteOptionsList')
    
    if event['type'] == 'createVote':
        
        check = votesList.query(
            KeyConditionExpression = Key('title').eq(event['vote_title'])
            )
        
        if check['Items']!=[]:
            response['body'] = False
            return response
        
        votesList.put_item(
            Item = {
                "title": event['vote_title'],
                "date": event['date'],
                "sponsor": event['sponsor'],
                "voters": 0
                }
            )
        
        options={"title": event['vote_title'],
                 "optionNum": len(event['options']),"picNum":event['pic']}
        for i in range(len(event['options'])):
            options['option'+str(i+1)] = event['options'][i]
            options['option'+str(i+1)+'_voters'] = 0
        
        voteOptionList.put_item(Item = options)
   
    return response