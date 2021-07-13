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

def create_plots(dates, date_in_ms=False):
    fp = "example_image.tif"
    img = rasterio.open(fp)
    fig, ax = plt.subplots(1,1, figsize=(6,6))
    plt.gca().set_axis_off()
    plt.subplots_adjust(top = 1, bottom = 0, right = 1, left = 0, hspace = 0, wspace = 0)
    plt.margins(1,1)

    cmaps = colormaps()
    
    for d in dates:
        cmap = random.choice(cmaps)
        a = show(img, cmap=cmap, ax=ax)
        
        if date_in_ms:
            date_str = f"{d}.png"
        else:
            date_str = f"{to_UNIX_ms(d)}.png"

        plt.savefig(date_str)

# Create a different version of the emissions / model output for each timestamp as well, can always compress these
# or save them as small images to save space
sites = ["NPL", "BTT", "TMB"]

dates = pd.date_range(start='2019-01-14', end='2019-10-18', freq='d')

dates_trimmed = [   "1547458200000",   "1548091800000",   "1548723600000",   "1549357200000",   "1549994400000",   "1551051000000",   "1551682800000",   "1552316400000",   "1552966200000",   "1553596200000",   "1554229800000",   "1554859800000",   "1555489800000",   "1556119800000",   "1556749800000",   "1557455400000",   "1558112400000",   "1558742400000",   "1559372400000",   "1560002400000",   "1560843000000",   "1561478400000",   "1562110200000",   "1562740200000",   "1563370200000",   "1564000200000",   "1564630200000",   "1565325000000",   "1565965800000",   "1566595800000",   "1567225800000",   "1567855800000",   "1568485800000",   "1569115800000",   "1569850200000",   "1570480200000",   "1571124600000" ]

# create_plots(dates_trimmed, date_in_ms=True)
# create_plots(dates)

def create_mock_emissions(sites, dates, val_min, val_max):
    data = {}

    n_dates = len(dates)

    for site in sites:
        gas_a = np.random.default_rng().uniform(val_min, val_max, n_dates)
        gas_b = np.random.default_rng().uniform(val_min, val_max, n_dates)
        gas_c = np.random.default_rng().uniform(val_min, val_max, n_dates)

        total = gas_a + gas_b + gas_c

        df = pd.DataFrame(data={"waste": gas_a, "agr-nat": gas_b, "comb-prod": gas_c}, index=dates)

        data[site] = json.loads(df.to_json())

    return data

ch4_data = create_mock_emissions(sites=sites, dates=dates, val_min=2000, val_max=2400)
co2_data = create_mock_emissions(sites=sites, dates=dates, val_min=400, val_max=475)
    
with open("randomSiteDataCH4.json", "w") as f:
    json.dump(ch4_data, f)

with open("randomSiteDataCO2.json", "w") as f:
    json.dump(co2_data, f)


