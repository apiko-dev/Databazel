<img src="https://s3-eu-west-1.amazonaws.com/jssolutions/databazel/imgs/bg_databazel.png" />

<ol>
 <li><b>DataBase.</b>
To start working with Databazel add a database to the app by typing its Mongo_URL and name it the way you like.
</li>
 <li><b>Creating Charts.</b>
Start creating your chart with choosing a DB (if you have added more than one). Then choose a collection to work with. You can join two collections as well.
<a href="https://www.youtube.com/watch?v=o_QK66x899s"><img src="https://s3-eu-west-1.amazonaws.com/jssolutions/databazel/imgs/youtube_3.png" /> </a>
</li>
 <ol type="I">
<li><b>Collection fields.</b>
You will see fields’ names and types of first 100 documents in the collection. Fields of nested objects are collapsed for default.

<img src="https://s3-eu-west-1.amazonaws.com/jssolutions/databazel/imgs/Collection_fields.gif" />

</li>
   <li><b>Table constructor.</b>
You can get raw data with “simple table” mode or perform grouping and aggregation operations in “pivot table” mode. To fetch data you need to just drag&drop the necessary field to the constructor or preview area. You can disable “Live mode” to stop fetching data after any change and enable it back to apply all changes to table at once.</li>
<ol type="i">
<li><b>Simple table.</b>
You can adjust the result by modifying the expression of the column (see appendix B.1). Check out pagination to manage the quantity of rows.

<img src="https://s3-eu-west-1.amazonaws.com/jssolutions/databazel/imgs/Simple+table.png" />

</li>
<li><b>Pivot table.</b>
Fast way to see the overall picture (see appendix  A).

<img src="https://s3-eu-west-1.amazonaws.com/jssolutions/databazel/imgs/Pivot+table.png" />

</li>
<li><b>Filtering, sorting & formatting numbers.</b>
Filter the data by fields in the constructors and sort it by clicking on the column header. You can format the view of numbers by going to context menu and entering the template.</li>
<li><b>SQL-like syntax.</b>
Querying to MongoDB could be tricky. To be sure you see what you need you might want to check out SQL-like syntax of mongo query (see appendix B).

<img src="https://s3-eu-west-1.amazonaws.com/jssolutions/databazel/imgs/sql-query.png" />

</li>
</ol>
  <li>
   <b>Chart constructor.</b>
When needed data is fetched from the DB, we are ready to visualize it. It is pretty simple - just click on a chart type. For now there are Bar, Line, Pie, Scatter, Radar, Polar, Donut charts and more are coming. To change the fields that are used to build the chart you can manage the checkboxes in chart constructor.
  </li>
<li><b>Export.</b>You can export your charts with .csv and .png files, or publish them by 
```
<iframe />.
```
</li></ol>
<li><b>Dashboard.</b> There is a dashboard for viewing the charts. It is a flexible workplace to check out your data from mongoDB. Add charts, resize and place them any way you like.
To be sure you are up to date with your data, toggle “Autorefresh” button.</li>
<li><b>User system.</b> The chart/dashboard can be accessed only by the user who created it. Simple user system allows to share charts/dashboards to other (previously invited) app users. Users, the chart has been shared to, have full access to the chart.

<a href="https://www.youtube.com/watch?v=_zOSNpMhi9w&t=1s"><img src="https://s3-eu-west-1.amazonaws.com/jssolutions/databazel/imgs/youtube_screen_2.png" /> </a>

</li>
</ol>

<h5>Appendixes</h5>

<ol type="A">
<li><b>Pivot Table.</b> Pivot table is used to work with the dataset as a single entity. Therefore, if you need to use any aggregation function (sum/count/avg/min/max) on documents, you should use pivot table.
</li>
<ol type="a">
<li>To see the result of aggregation function, drop target field to values block.
To see the result splitted by other field values, drop that field to rows/columns block.</li> 
<li>You can add up to tree fields to columns/rows. 
For dates you can select the level of grouping.</li>
<li>You can color values cells of pivot table based on min and max values. Go to the context menu of field in constructor block.</li>
</ol>
<li><b>SQL-like syntax.</b> SQL syntax is common and more comfortable for querying data . You are free to edit it. Databazel uses SQL^2, which supports all clauses of <code>SELECT</code> statement of ANSI SQL:</li>
<ol type="a">
<li><code>SELECT</code>.</li><ol>
<li>Each expression corresponds to the expression of the column you see in a resulting table.</li>
<li><code>CASE , WHEN, DEFAULT</code> provide if-then-else logic.</li>
<li><code>TO_TIMESTAMP</code> function converts Unix time (milliseconds) to a timestamp.</li>
<li>You can find rest clauses, operators and functions in the documentation.</li.</li></ol>
<li><code>FROM</code> depends on the database and the collection you have chosen to work with. Not editable.</li>
<li><code>WHERE, HAVING </code>correspond to columns’ filters.</li>
<li><code>GROUP BY</code> depends on <code>SELECT</code> clause.</li>
<li><code>ORDER BY, DESC, ASC</code> correspond to sorting of columns.</li>
<li><code>LIMIT, OFFSET</code> correspond to pagination.</li>
<br/>
More details on SQL^2 are in its <a href="http://quasar-analytics.org/docs/sqlreference/">documentation</a>.
</ol>
<ol>
