import ephem
import numpy as np
import datetime

# Specify the start and end dates for the ephemeris data
start_date = datetime.datetime(2023, 1, 1)
end_date = datetime.datetime(2024, 1, 1)

dates = [start_date + datetime.timedelta(days=i) for i in range((end_date - start_date).days)]

positions = []
for date in dates:
    uranus = ephem.Uranus()
    uranus.compute(date)


    positions.append([float(uranus.hlon), float(uranus.hlat), float(uranus.sun_distance)])

# Convert the positions list to a NumPy array
positions = np.array(positions)

# Create a header for the CSV file
header = 'x,y,z'

# Save the positions and header to a CSV file
np.savetxt('uranus_positions.csv', positions, delimiter=',', header=header, comments='')
