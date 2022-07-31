import json
from numbers import Number
from calc_coords import *


plot_data_file = open('map_plots_bottom.json', 'r')
plot_data = json.loads(plot_data_file.read())


# 1
"orientation": "northwest_wall_angle-2.1-180",
"anchor": {"start": {"plotNumber": 26, "corner": 3}, "displacements": [{"distance": [
    57], "bearing": "northwest_wall_angle-.15"}, {"distance": [1.4], "bearing": "northwest_wall_angle-90"}]},
"width": [8]


# 2
"anchor": {"start": {"plotNumber": 170, "corner": 2}, "displacements": [{"distance": [8+3, 4], "bearing": "last_orientation-90"}]},
"width": [8]


# 3
"anchor": {"start": {"plotNumber": 171, "corner": 1}, "displacements": [{"distance": [0], "bearing": "last_orientation+180"}]},
"width": [8]


# 4
"orientation": "northwest_wall_angle+1-180",
"anchor": {"start": {"plotNumber": 168, "corner": 1}, "displacements": [{"distance": [2.2*9], "bearing": "this_orientation+35"}]},
"width": [8]


# 5
"anchor": {"start": {"plotNumber": 180, "corner": 1}, "displacements": []}
"width": [8]


# 6
"orientation": "northwest_wall_angle-180",
"anchor": {"start": {"plotNumber": 185, "corner": 2}, "displacements": [{"distance": [8+4], "bearing": "this_orientation-90"}]},
"width": [8]


# 7
"orientation": "northwest_wall_angle + 10.5 - 180",
"anchor": {"start": {"plotNumber": 183, "corner": 1}, "displacements": [{"distance": [11.1], "bearing": "northwest_wall_angle-35"}]},
"width": [8]


# 8
"anchor": {"start": {"plotNumber": 195, "corner": 1}, "displacements": [{"distance": [6, 2], "bearing": "last_orientation-180"}, {"distance": 0.35, "bearing": "last_orientation+90"}]},
"width": [8]


# 9
"anchor": {"start": {"plotNumber": 209, "corner": 3}, "displacements": [{"distance": [
    4.1], "bearing": "last_orientation+30+180"}]})
"width": [10]


# 10
"anchor": {"start": {"plotNumber": 202, "corner": 1}, "displacements": [{"distance": [7, 11], "bearing": "last_orientation+35"}]},
"width": [8]


# 11
"anchor": {"start": {"plotNumber": 219, "corner": 1}, "displacements": [{"distance": [1, 2], "bearing": "last_orientation+140"}]},
"width": [8]


# 12
"orientation": "northwest_wall_angle + 6.5 - 180",
"anchor": {"start": {"plotNumber": 211, "corner": 1}, "displacements": [{"distance": [2, 4], "bearing": "this_orientation+90"}]},
"width": [8]


# 13
"orientation": "northwest_wall_angle - 180",
"anchor": {"start": {"plotNumber": 230, "corner": 3}, "displacements": []})
"width": [8]


# 14
"orientation": "northwest_wall_angle + 6.5 - 180",
"anchor": {"start": {"plotNumber": 225, "corner": 1}, "displacements": [{"distance": [9.56], "bearing": "this_orientation+16"}]},
"width": [8]


# 15
"orientation": "northwest_wall_angle - 180",
"anchor": {"start": {"plotNumber": 242, "corner": 3}, "displacements": []})
"width": [8]


# 16
"orientation": "northwest_wall_angle + 6.5 - 180",
"anchor": {"start": {"plotNumber": 237, "corner": 1}, "displacements": [{"distance": [9.56], "bearing": "this_orientation+24"}]},
"width": [8]


# 17
"orientation": "northwest_wall_angle + 6.5 - 180",
"anchor": {"start": {"plotNumber": 249, "corner": 1}, "displacements": [{"distance": [4.6], "bearing": "this_orientation+80"}]},
"width": [8]
