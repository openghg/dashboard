""" This creates random emissions, model and observations data


"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
import rasterio
# from matplotlib.pyplot import colormaps
import matplotlib.pyplot as plt
from rasterio.plot import show
import random

div_cmaps = [ 'PiYG',
 'PiYG_r',
 'PuBu',
 'PuBuGn',
 'PuBuGn_r',
 'PuBu_r',
 'PuOr',
 'PuOr_r',
 'PuRd',
 'PuRd_r',
 'Purples',
 'Purples_r',
 'RdBu',
 'RdBu_r',
 'RdGy',
 'RdGy_r',
 'RdPu',
 'RdPu_r',
 'RdYlBu',
 'RdYlBu_r',
 'RdYlGn',
 'RdYlGn_r',
 'Reds',
 'Reds_r',
 'Set1',
 'Set1_r',
 'Set2',
 'Set2_r',
 'Set3',
 'Set3_r',
 'Spectral',
 'Spectral_r',
]

def to_UNIX_ms(t):
    # Converts a date to a UNIX ms time string
    return str((pd.Timestamp(t) - pd.Timestamp("1970-01-01")) // pd.Timedelta("1ms"))

def create_plots(dates):
    fp = "example_image.tif"
    img = rasterio.open(fp)
    fig, ax = plt.subplots(1,1, figsize=(6,6))
    plt.gca().set_axis_off()
    plt.subplots_adjust(top = 1, bottom = 0, right = 1, left = 0, hspace = 0, wspace = 0)
    plt.margins(1,1)
    
    for d in dates:
        cmap = random.choice(div_cmaps)
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

    total = gas_a + gas_b + gas_c

    df = pd.DataFrame(data={"sector_a": gas_a, "sector_b": gas_b, "sector_c": gas_c, "total": total}, index=dates)

    data[site] = json.loads(df.to_json())

with open("randomSiteData.json", "w") as f:
    json.dump(data, f)


