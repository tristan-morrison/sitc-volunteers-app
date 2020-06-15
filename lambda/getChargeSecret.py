import stripe
import json

# Standard registration fee in cents
REGISTRATION_FEE = 4000
CURRENCY = "usd"

def calculate_order_amount(donation_amount=0):
    # TODO add check for negative donation amount
    return REGISTRATION_FEE + donation_amount

def lambda_handler(event, context):
    intent = stripe.PaymentIntent.create(
        amount=calculate_order_amount(event['amount']),
        currency=CURRENCY
    )

