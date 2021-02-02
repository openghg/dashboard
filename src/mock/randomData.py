import pandas as pd
import numpy as np
import json
from pathlib import Path

sites = ["AAA", "BBB", "CCC"]

dates = pd.date_range(start='2020-06-01', end='2021-01-01', freq='D', tz="UTC")

data = {}

n_dates = len(dates)

for site in sites:
    gas_a = np.random.default_rng().uniform(0.2, 0.5, n_dates)
    gas_b = np.random.default_rng().uniform(0.6, 0.9, n_dates)
    gas_c = np.random.default_rng().uniform(0.0, 0.3, n_dates)

    df = pd.DataFrame(data={"gas_a": gas_a, "gas_b": gas_b, "gas_c": gas_c}, index=dates)

    json_data = json.loads(df.to_json())

    data[site] = json_data

with open("randomSiteData.json", "w") as f:
    json.dump(data, f)


