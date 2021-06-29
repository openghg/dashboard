""" This creates random emissions, model and observations data


"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
import rasterio
from matplotlib.pyplot import colormaps
import matplotlib.pyplot as plt
from rasterio.plot import show
import random

def to_UNIX_ms(t):
    # Converts a date to a UNIX ms time string
    return str((pd.Timestamp(t) - pd.Timestamp("1970-01-01")) // pd.Timedelta("1ms"))

def create_plots(dates):
    fp = "example_image.tif"
    img = rasterio.open(fp)
    fig, ax = plt.subplots(1,1, figsize=(6,6))
    
    cmaps = colormaps()


    for d in dates:
        cmap = random.choice(cmaps)
        a = show(img, cmap=cmap, ax=ax)
        date_str = f"{to_UNIX_ms(d)}.png"
        plt.savefig(date_str)

# Create a different version of the emissions / model output for each timestamp as well, can always compress these
# or save them as small images to save space
sites = ["AAA", "BBB", "CCC"]

dates = pd.date_range(start='2021-01-01', end='2021-01-31', freq='D')

create_plots(dates)

data = {}

n_dates = len(dates)

for site in sites:
    gas_a = np.random.default_rng().uniform(0.2, 0.5, n_dates)
    gas_b = np.random.default_rng().uniform(0.6, 0.9, n_dates)
    gas_c = np.random.default_rng().uniform(0.0, 0.3, n_dates)

    df = pd.DataFrame(data={"gas_a": gas_a, "gas_b": gas_b, "gas_c": gas_c}, index=dates)

    data[site] = json.loads(df.to_json())

with open("randomSiteData.json", "w") as f:
    json.dump(data, f)


