# Recommendation Engine(Backend Path - Welbi)
This backend contains the endpoint `/programs/isolated-residents` which returns the three candidate programs that engages multiple isolated residents (those who have not been to a program recently)

# Requirements
```
node >= 18
```

# Installation
```bash
npm i
```

# Run
To run the backend, run the below script:
```bash
npm run dev
```
and navigate to http://localhost:3000/api-docs to test out the apis

# Test
```bash
npm run test
```

## Understanding the problem
> Engages multiple isolated residents (those who have not been to a program recently)
  - `Engages` is interpreted as programs that align with the hobbies and level of care of the residents

  - `isolated residents` is interpreted as residents that have not attended a program within the expected time frame 

  - `recently` is interpreted as a specific time interval that starts from a given date and ends with today's date
  (In this case, it is placed within the endpoint query, but ideally it could be part of the configuration).

## Solution Design
  Solution: Find the isolated residents -> find programs that engage isolated residents -> sort and slice the top 3 programs with the most engagement
  - Obtain the date to start considering isolated residents. 
  - Find the residents that have attended programs after the given date (`residentsRecentlyAttended`). A set is returned by this function to reduce the time complexity for calculating isolated residents.
  - From the total residents, the residents that are not within `residentsRecentlyAttended` set are considered residents that did not attend programs within the given time interval(isolated residents). 
  - Compute the unique programs from the list of programs using the name field from uniqueness. A map is used to remove duplicates and keep hobbies and levelsOfCare in array format for each unique program.
  - Find the programs that align with hobbies and level of care of the isolated residents and store the number of isolated residents that are engaged by each program.
  - Sort the program list, according to the resident count, in descending order and slice the top 3.


## Improvements And Next Steps
- Fields with comma delimiters can use arrays(string[]) instead 
- Fields with preset values like `levelOfCare`, `mode` or `dimensions` can use enums
- Program Attendees field only requires userId and can be changed to an array of userIds.
- validate json with a specific schema
- Have a separate distinct programs list within the json with a specific program id
- Add likes & dislikes to every program
