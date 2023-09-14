import sys
import json
a = sys.argv[1]
a = a.strip("'")
userId = float(a)
import pandas as pd
from collections import defaultdict
from datetime import date


#Reading files
merchantMap = pd.read_excel("File-01.xlsx","Merchant_Mapping")
merchant_details = pd.read_excel("File-02.xlsx","Merchant Details")

transaction_det = pd.read_excel("File-02.xlsx",'Transactions')
transaction_det['Date and Time'] = pd.to_datetime(transaction_det['Date and Time'])

offers = pd.read_excel("File-04.xlsx")
offers = offers.dropna()
offers['Merchant_Name'] = offers['Merchant_Name'].str.strip()
#print(offers)
offers['Offer_start_date'] = pd.to_datetime(offers['Offer_start_date'])
# offers['Offer_end_date'] = pd.to_datetime(offers['Offer_end_date'])



def fetch_past_trn(userId):
  user_id = userId
  userTransac = transaction_det[transaction_det.User_id==user_id]
  return(userTransac)


def getOffers(offer_merchants):
  final_offers = defaultdict(list)
  location = 'Chennai'
  tdate = date.today()
  applicable_offers = offers.query('Location == @location & Offer_start_date <= @tdate & Offer_end_date >= @tdate')
  #print(applicable_offers)
  #print(applicable_offers.query('Merchant_Name == "Uber"'))
  for i,j in offer_merchants.items():
    for merch in j:
      #sprint(i,merch)
      # final_offers[i] = list(applicable_offers[applicable_offers.Merchant_Name==merch])
      a = applicable_offers.query('Merchant_Name == @merch')

      new_df = a[["Merchant_Name","Category","Offers","Offer Value"]]
      print(new_df)
      l1 = new_df.values.tolist()
      #print(l1)
      if(len(l1)== 0):
         continue
      else:
        final_offers[i].append(l1)

  return final_offers



def userMerchant(userTransaction):
  return list(set(userTransaction["Merchant_name"]))

userGender = 'M' #find it using the mailid
userAge = 27

userTransaction = fetch_past_trn(userId)
userMerchantDetails = userMerchant(fetch_past_trn(userId)) #incomplete

# Joining User transaction with merchant mapping based on past transactions

mappedResult = userTransaction.merge(merchantMap, left_on="Merchant_name", right_on="Merchant 1", how="inner")

recommendedMerchantsOnPast = mappedResult.drop_duplicates(subset=['Behave_Category','Merchant 2']).groupby('Behave_Category')['Merchant 2'].agg(list).to_dict()

# Age/Gender based recommendation
if(userGender=="M"):
  common_merchants = merchant_details[merchant_details["Gender"] != "F"]
else:
    common_merchants = merchant_details[merchant_details["Gender"] == "F"]

#Setting age upper and lower bound


# Assuming common_merchants is your DataFrame
common_merchants = common_merchants.copy()
common_merchants[['LowerBound', 'UpperBound']] = common_merchants["Age"].str.split('-', expand=True)
common_merchants[['LowerBound', 'UpperBound']] = common_merchants[['LowerBound', 'UpperBound']].astype(int)

#age based filter

ageBasedFilter = common_merchants[(userAge>=common_merchants['LowerBound']) & (userAge<=common_merchants['UpperBound']) ]

# joining user past transactions with merchant mapping and merchant details

ageMappedResult = userTransaction.merge(ageBasedFilter, left_on="Merchant_name", right_on="Merchant_Name", how="inner")
ageMapppedResultFinal = ageMappedResult.merge(merchantMap,left_on="Merchant_Name",right_on="Merchant 2",how="inner")

#age based recommendations
ageRecommendedList = ageMapppedResultFinal.drop_duplicates(subset=['Behave_Category','Merchant 2']).groupby('Behave_Category')['Merchant 2'].agg(list).to_dict()

d1 = getOffers(recommendedMerchantsOnPast)
#print(getOffers(ageRecommendedList))
d1.update(getOffers(ageRecommendedList))
# Specify the file path where you want to save the dictionary
file_path = "data.json"

# Serialize the dictionary to JSON and write it to the file
with open(file_path, 'w') as json_file:
    json.dump(d1, json_file)










