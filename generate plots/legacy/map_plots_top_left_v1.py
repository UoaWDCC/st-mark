from calc_coords import *

plot_data = {"row1_plots": [
    {"plotNumber": 100002, "height": feet_inch_to_m(
        5, 9), "registeredName": "Kidd"},
    {"plotNumber": 100003, "height": feet_inch_to_m(
        12, 10), "registeredName": "Whisker"},
    {"plotNumber": 100004, "height": feet_inch_to_m(
        6, 3), "registeredName": "Stanley"},
    {"plotNumber": 100005, "height": feet_inch_to_m(
        5), "registeredName": "Wilson"},
    {"plotNumber": 100006, "height": feet_inch_to_m(
        7), "registeredName": "Allom"},
    {"plotNumber": 100007, "height": feet_inch_to_m(
        3), "registeredName": "Wills"},
    {"plotNumber": 100008, "height": feet_inch_to_m(
        8, 9), "registeredName": "Clayton"},
    {"plotNumber": 100009, "height": feet_inch_to_m(
        9), "registeredName": "Jones"},
    {"plotNumber": 100010, "height": feet_inch_to_m(
        7, 6), "registeredName": "Shipherd"},
    {"plotNumber": 100011, "height": feet_inch_to_m(
        6, 6), "registeredName": "Phillipson"},
    # height on map is ambiguous ^ 🤨
    {"plotNumber": 100012, "height": feet_inch_to_m(
        4, 6), "registeredName": "Cook"},
    {"plotNumber": 100013, "height": feet_inch_to_m(
        9), "registeredName": "McQuillen"},

    # padding between two plots (i.e. empty space) 👇
    {"height": feet_inch_to_m(3)},

    {"plotNumber": 100014, "height": feet_inch_to_m(
        7), "registeredName": "Palmer"},
    {"plotNumber": 100015, "height": feet_inch_to_m(
        4), "registeredName": "Bassett"},
    {"plotNumber": 100016, "height": feet_inch_to_m(
        12), "registeredName": "Banks"},
    {"plotNumber": 100017, "height": feet_inch_to_m(
        3), "registeredName": "G.U."},
    # ambiguous name ^
    {"plotNumber": 100018, "height": feet_inch_to_m(
        4), "registeredName": "Burnette"},

    {"height": feet_inch_to_m(3, 9)},

    {"plotNumber": 100019, "height": feet_inch_to_m(
        4), "registeredName": "Cromby"},
    {"plotNumber": 100020, "height": feet_inch_to_m(
        8), "registeredName": "Heywood"},
    {"plotNumber": 100021, "height": feet_inch_to_m(
        8), "registeredName": "Buchanan"},
    {"plotNumber": 100022, "height": feet_inch_to_m(
        8, 6), "registeredName": "Harrop"},
    {"plotNumber": 100023, "height": feet_inch_to_m(
        9, 9), "registeredName": "Hesketh"},
    {"plotNumber": 100024, "height": feet_inch_to_m(
        5), "registeredName": "Coster"},
    {"plotNumber": 100025, "height": feet_inch_to_m(
        9), "registeredName": "Serle"},
    {"height": feet_inch_to_m(9/10)},
    {"plotNumber": 100026, "height": feet_inch_to_m(
        9), "registeredName": "W.Horn"},
],
    "row2_plots": [
    {"plotNumber": 100027, "height": feet_inch_to_m(
        7), "registeredName": "Mucklestone"},
    {"plotNumber": 100028, "height": feet_inch_to_m(
        9), "registeredName": "Crisp"},
    {"plotNumber": 100029, "height": feet_inch_to_m(
        9), "registeredName": "Railey"},
    {"plotNumber": 100030, "height": feet_inch_to_m(
        7), "registeredName": "Alderton"},
    {"plotNumber": 100031, "height": feet_inch_to_m(
        9), "registeredName": "Holmes"},
    {"plotNumber": 100032, "height": feet_inch_to_m(
        9), "registeredName": "Barnett"},
    {"plotNumber": 100033, "height": feet_inch_to_m(
        4, 6), "registeredName": "Charles"},

    {"height": feet_inch_to_m(2, 5)},

    {"plotNumber": 100034, "height": feet_inch_to_m(
        8), "registeredName": "Osborne"},
    {"plotNumber": 100035, "height": feet_inch_to_m(
        9), "registeredName": "Clark"},
    {"plotNumber": 100036, "height": feet_inch_to_m(
        8, 9), "registeredName": "Archer"},
    {"plotNumber": 100037, "height": feet_inch_to_m(
        4, 6), "registeredName": "Richardson"},
    {"plotNumber": 100038, "height": feet_inch_to_m(
        4, 6), "registeredName": "Heard"},
    {"plotNumber": 100039, "height": feet_inch_to_m(
        9), "registeredName": "Edwards"},
    {"plotNumber": 100040, "height": feet_inch_to_m(
        9), "registeredName": "Garland"},
    {"plotNumber": 100041, "height": feet_inch_to_m(
        9), "registeredName": "Jones"},
    {"plotNumber": 100042, "height": feet_inch_to_m(
        11), "registeredName": "McGuire"},
    {"plotNumber": 100043, "height": feet_inch_to_m(
        11), "registeredName": "Aickin"},
    {"plotNumber": 100044, "height": feet_inch_to_m(
        6), "registeredName": "Yonge"},
    {"plotNumber": 100045, "height": feet_inch_to_m(
        13), "registeredName": "S. Hesketh"},
],
    "row3_plots": [
    {"plotNumber": 100046, "height": feet_inch_to_m(
        8, 3), "registeredName": "Margan"},
    {"plotNumber": 100047, "height": feet_inch_to_m(
        13, 3), "registeredName": "Edgerley"},
    {"plotNumber": 100048, "height": feet_inch_to_m(
        9, 6), "registeredName": "Roberts"},
    {"plotNumber": 100049, "height": feet_inch_to_m(
        9, 9), "registeredName": "Maxwell"},
    {"plotNumber": 100050, "height": feet_inch_to_m(
        9), "registeredName": "Whisker"},
    {"plotNumber": 100051, "height": feet_inch_to_m(
        9), "registeredName": "Lennard"},
    {"plotNumber": 100052, "height": feet_inch_to_m(
        6), "registeredName": "Bassett"},
    {"plotNumber": 100053, "height": feet_inch_to_m(
        4, 6), "registeredName": "Price"},
    {"plotNumber": 100054, "height": feet_inch_to_m(
        10), "registeredName": "Knight"},
    {"plotNumber": 100055, "height": feet_inch_to_m(
        9), "registeredName": "Bruce"},
    {"plotNumber": 100056, "height": feet_inch_to_m(
        9), "registeredName": "J.Smith"},
    {"plotNumber": 100057, "height": feet_inch_to_m(
        6, 3), "registeredName": "Cook"},
    {"plotNumber": 100058, "height": feet_inch_to_m(
        9), "registeredName": "Worden"},
    {"plotNumber": 100059, "height": feet_inch_to_m(
        8), "registeredName": "Barnsley"},
    {"plotNumber": 100060, "height": feet_inch_to_m(
        6, 3), "registeredName": "Crowhurst"},
    {"plotNumber": 100061, "height": feet_inch_to_m(
        6, 3), "registeredName": "G.S. Wood"},
    {"plotNumber": 100062, "height": feet_inch_to_m(
        5), "registeredName": "Carson"},
],
    "row4_plots": [
    {"plotNumber": 100063, "height": feet_inch_to_m(
        4, 6), "registeredName": "Redmand"},
    {"plotNumber": 100064, "height": feet_inch_to_m(
        7, 9), "registeredName": "J. Williams"},
    {"plotNumber": 100065, "height": feet_inch_to_m(
        8, 3), "registeredName": "Prill"},  # ambiguous width
    {"plotNumber": 100066, "height": feet_inch_to_m(
        9), "registeredName": "Pickmere"},
    {"plotNumber": 100067, "height": feet_inch_to_m(
        4, 6), "registeredName": "King"},
    {"plotNumber": 100068, "height": feet_inch_to_m(
        4, 6), "registeredName": "Lord"},
    {"plotNumber": 100069, "height": feet_inch_to_m(
        9, 9), "registeredName": "Graham"},
    {"plotNumber": 100070, "height": feet_inch_to_m(
        9, 6), "registeredName": "Patterson"},

    {"height": 0.3},

    {"plotNumber": 100071, "height": feet_inch_to_m(
        8), "registeredName": "Russell"},
    {"plotNumber": 100072, "height": feet_inch_to_m(
        10), "registeredName": "Larkins"},
    {"plotNumber": 100073, "height": feet_inch_to_m(
        9, 6), "registeredName": "Browning"},
    {"plotNumber": 100074, "height": feet_inch_to_m(
        9), "registeredName": "Reach"},
    {"plotNumber": 100075, "height": feet_inch_to_m(
        4, 6), "registeredName": "Potter"},
],
    "row5_plots": [
    {"plotNumber": 100076, "height": feet_inch_to_m(
        9), "registeredName": "Hamlin"},
    {"plotNumber": 100077, "height": feet_inch_to_m(
        9), "registeredName": "Tye"},
    {"plotNumber": 100078, "height": feet_inch_to_m(
        9), "registeredName": "Bishop"},

    {"height": 0.26},

    {"plotNumber": 100079, "height": feet_inch_to_m(
        9), "registeredName": "Austin"},
    {"plotNumber": 100080, "height": feet_inch_to_m(
        10), "registeredName": "Reeves"},
    {"plotNumber": 100081, "height": feet_inch_to_m(
        7), "registeredName": "Kinder"},     # ambiguous width
    {"plotNumber": 100082, "height": feet_inch_to_m(
        6, 6), "registeredName": "Box"},     # ambiguous width and height
]
}
