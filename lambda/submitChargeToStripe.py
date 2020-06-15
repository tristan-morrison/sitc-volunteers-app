import json
import stripe
from pprint import pprint

stripe.api_key = "sk_test_15GXveb8D3IfzP998jR1LmgW"

def lambda_handler(event, context):
    mySource = event["source"] if (event["source"]) else ""
    myAmount = event["amount"] if (event["amount"]) else 0
    myDescription = event["description"] if (event["description"]) else "SITC Registration"
    myStatementDescriptor = event["statement_descriptor"] if event["statement_descriptor"] else "Summer in the City"

    try:
        charge = stripe.Charge.create(
            amount=myAmount,
            currency="usd",
            source=mySource,
            description=myDescription,
            capture=False
        )

    except stripe.error.CardError as e:
        pass    
    except stripe.error.StripeError as e:
        pass

    # return {
    #     'statusCode': 200,
    #     'body': json.dumps('Hello from Lambda!')
    # }

myEvent = {
    "source": "ldkfj09rjdsl209dkdi7fjld9",
    "amount": 4000,
    "description": "SITC Reg",
    "statement_descriptor": "Summer in the City"
}

lambda_handler(myEvent, None)

