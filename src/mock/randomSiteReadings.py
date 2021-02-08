import json
import pandas as pd
import random

with open("../data/siteData.json", "r") as f:
    data = json.load(f)

def to_UNIX_ms(t):
    # Converts a date to a UNIX ms time string
    return (pd.Timestamp(t) - pd.Timestamp("1970-01-01")) // pd.Timedelta("1ms")

date_range = pd.date_range(start="2021-01-01", end="2021-03-30", freq="3D")

for site, values in data.items():
    values["measurements"] = {to_UNIX_ms(d): random.randint(20,90) for d in date_range}


with open("randomLGHG.json", "w") as f:
    json.dump(data, f, indent=4)