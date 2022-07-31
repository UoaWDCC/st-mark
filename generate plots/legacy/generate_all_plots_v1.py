from calc_coords import *

# graveyard variables
northwest_wall_angle = 216.5  # degrees from true north

############ ROW 1 ############
# direction u  r facing when looking @ gravestone
row_orientation = northwest_wall_angle+.125-180

plot2_coords = {"lat": -36.87241435760838, "lng": 174.780340850825}
row1_plots = [
    {"plotNumber": 102, "height": feet_inch_to_m(
        5, 9), "registeredName": "Kidd"},
    {"plotNumber": 103, "height": feet_inch_to_m(
        12, 10), "registeredName": "Whisker"},
    {"plotNumber": 104, "height": feet_inch_to_m(
        6, 3), "registeredName": "Stanley"},
    {"plotNumber": 105, "height": feet_inch_to_m(
        5), "registeredName": "Wilson"},
    {"plotNumber": 106, "height": feet_inch_to_m(
        7), "registeredName": "Allom"},
    {"plotNumber": 107, "height": feet_inch_to_m(
        3), "registeredName": "Wills"},
    {"plotNumber": 108, "height": feet_inch_to_m(
        8, 9), "registeredName": "Clayton"},
    {"plotNumber": 109, "height": feet_inch_to_m(
        9), "registeredName": "Jones"},
    {"plotNumber": 110, "height": feet_inch_to_m(
        7, 6), "registeredName": "Shipherd"},
    {"plotNumber": 111, "height": feet_inch_to_m(
        6, 6), "registeredName": "Phillipson"},
    # height on map is ambiguous ^ 🤨
    {"plotNumber": 112, "height": feet_inch_to_m(
        4, 6), "registeredName": "Cook"},
    {"plotNumber": 113, "height": feet_inch_to_m(
        9), "registeredName": "McQuillen"},
    # padding between two plots (i.e. empty space) 👇
    {"height": feet_inch_to_m(3)},
    {"plotNumber": 114, "height": feet_inch_to_m(
        7), "registeredName": "Palmer"},
    {"plotNumber": 115, "height": feet_inch_to_m(
        4), "registeredName": "Bassett"},
    {"plotNumber": 116, "height": feet_inch_to_m(
        12), "registeredName": "Banks"},
    {"plotNumber": 117, "height": feet_inch_to_m(
        3), "registeredName": "G.U."},
    # ambiguous name ^
    {"plotNumber": 118, "height": feet_inch_to_m(
        4), "registeredName": "Burnette"},
    {"height": feet_inch_to_m(3, 5)},
    {"plotNumber": 119, "height": feet_inch_to_m(
        4), "registeredName": "Cromby"},
    {"plotNumber": 120, "height": feet_inch_to_m(
        8), "registeredName": "Heywood"},
    {"plotNumber": 121, "height": feet_inch_to_m(
        8), "registeredName": "Buchanan"},
    {"plotNumber": 122, "height": feet_inch_to_m(
        8, 6), "registeredName": "Harrop"},
    {"plotNumber": 123, "height": feet_inch_to_m(
        9, 9), "registeredName": "Hesketh"},
    {"plotNumber": 124, "height": feet_inch_to_m(
        5), "registeredName": "Coster"},
    {"plotNumber": 125, "height": feet_inch_to_m(
        9), "registeredName": "Serle"},
    {"height": feet_inch_to_m(0, 10)},
    {"plotNumber": 126, "height": feet_inch_to_m(
        9), "registeredName": "W.Horn"},
]
calc_plot_rows(feet_inch_to_m(8), row1_plots,
               plot2_coords, row_orientation)

# ## set 2 ##
# row2_plots = [
#     {"plotNumber": 114, "height": feet_inch_to_m(
#         7), "registeredName": "Palmer"},
#     {"plotNumber": 115, "height": feet_inch_to_m(
#         4), "registeredName": "Bassett"},
#     {"plotNumber": 116, "height": feet_inch_to_m(
#         12), "registeredName": "Banks"},
#     {"plotNumber": 117, "height": feet_inch_to_m(
#         3), "registeredName": "G.U."},
#     # ambiguous name ^
#     {"plotNumber": 118, "height": feet_inch_to_m(
#         4), "registeredName": "Burnette"},
# ]
# calc_plot_rows(feet_inch_to_m(8), row2_plots,
#                add_distance_2(get_plot_coords(113)[3], feet_inch_to_m(3), northwest_wall_angle+.125), northwest_wall_angle+.125-180)
# # print(add_distance_2(get_plot_coords(113)[3],
# #       feet_inch_to_m(3), northwest_wall_angle+.125))
# # print(get_plot_coords(113))

# row3_plots = [
#     {"plotNumber": 119, "height": feet_inch_to_m(
#         4), "registeredName": "Cromby"},
#     {"plotNumber": 120, "height": feet_inch_to_m(
#         8), "registeredName": "Heywood"},
#     {"plotNumber": 121, "height": feet_inch_to_m(
#         8), "registeredName": "Buchanan"},
#     {"plotNumber": 122, "height": feet_inch_to_m(
#         8, 6), "registeredName": "Harrop"},
#     {"plotNumber": 123, "height": feet_inch_to_m(
#         9, 9), "registeredName": "Hesketh"},
#     {"plotNumber": 124, "height": feet_inch_to_m(
#         5), "registeredName": "Coster"},
#     {"plotNumber": 125, "height": feet_inch_to_m(
#         9), "registeredName": "Serle"},
# ]

# calc_plot_rows(feet_inch_to_m(8), row3_plots,
#                add_distance_2(get_plot_coords(118)[1], feet_inch_to_m(3, 5), northwest_wall_angle+.125), northwest_wall_angle+.125-180)


# row4_plots = [

#     {"plotNumber": 126, "height": feet_inch_to_m(
#         9), "registeredName": "W.Horn"},
# ]

# calc_plot_rows(feet_inch_to_m(8), row4_plots,
#                add_distance_2(get_plot_coords(125)[3], feet_inch_to_m(0, 10), northwest_wall_angle+.125), northwest_wall_angle+.125-180)

# row5_plots = [

#     {"plotNumber": 127, "height": feet_inch_to_m(
#         7), "registeredName": "Mucklestone"},
#     {"plotNumber": 128, "height": feet_inch_to_m(
#         9), "registeredName": "Crisp"},
#     {"plotNumber": 129, "height": feet_inch_to_m(
#         9), "registeredName": "Railey"},
#     {"plotNumber": 130, "height": feet_inch_to_m(
#         7), "registeredName": "Alderton"},
#     {"plotNumber": 131, "height": feet_inch_to_m(
#         9), "registeredName": "Holmes"},
#     {"plotNumber": 132, "height": feet_inch_to_m(
#         9), "registeredName": "Barnett"},
#     {"plotNumber": 133, "height": feet_inch_to_m(
#         4, 6), "registeredName": "Charles"},
# ]

# calc_plot_rows(feet_inch_to_m(8), row5_plots,
#                add_distance_2(add_distance_2(get_plot_coords(102)[1], feet_inch_to_m(4), northwest_wall_angle+.125-90), 0.5, northwest_wall_angle+.125), northwest_wall_angle+.125-180)
