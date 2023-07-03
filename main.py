import ephem
import numpy as np
import datetime

# Specify the start and end dates for the ephemeris data
start_date = datetime.datetime(2023, 1, 1)
end_date = datetime.datetime(2024, 1, 1)

# Create an array of dates
dates = [start_date + datetime.timedelta(days=i) for i in range((end_date - start_date).days)]

# Compute the positions of Uranus for each date
positions = []
for date in dates:
    # Compute the position of Uranus for the given date
    uranus = ephem.Uranus()
    uranus.compute(date)
    sun = ephem.Sun()
    sun.compute(date)

    # Compute the distance between Uranus and the Sun
    distance = ephem.separation(uranus, sun)

    # Append the position data to the list
    positions.append([float(uranus.ra), float(uranus.dec), float(distance)])

# Convert the positions list to a NumPy array
positions = np.array(positions)

# Create a header for the CSV file
header = 'x,y,z'

# Save the positions and header to a CSV file
np.savetxt('uranus_positions.csv', positions, delimiter=',', header=header, comments='')
