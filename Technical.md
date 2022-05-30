# AnalysisChallenge

-get data to fill the dropdown lists
-filter the data based on user selection
-solve the problem of not sorted data by month
-get all the lessons for filtered data
-get data for the clicked item
-preserve the last filtering state
-render the chart again when come back from the details page

## get data to fill the dropdown lists

first i had to get unique values for country, camp and school, it was about array of 300 elements, so i used Set to get unique values of them and fill the dropdown lists.

## filter the data based on user selection

it wasn't obvious that each dropdown part from another dropdown or not ,so i dealt with them as seperate filter and checked for every value of the filter and filtered the data based on it.

## solve the problem of not sorted data by month

there were 2 problems related to months, first is that the data is not sorted by month, and the second that there are some months don't have any lessons, so i used a loop to fill the empty months with 0.

## get all the lessons for filtered data

to get the total lessons per filtered data , i must first get the data grouped by every school in the filtered data, and after that i used reduce to get the total lessons per school.

## get data for the clicked item

the chart only containes the month and the school name and the no of lessons, so i need also to get the country and camp name of the clicked item.
so i get them from the filter data and set them on data service, and then i navigate to the details page,and get them also from there.

## preserve the last filtering state

as  the same way i get the state from a data service.

## render the chart again when come back from the details page

I had to render the chart again when come back from the details page, so i used the same logic as in the get data for the filtered data.
