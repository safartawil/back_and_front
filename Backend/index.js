const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
// const bp = require('body-parser');

app.use(cors());
app.use(express.json());

// app.use(bp.json())
// app.use(bp.urlencoded({ extended: true }))

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}`));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sem_charts",
});



app.get("/loadallclients", (req , res) => {
   
    db.query("SELECT DISTINCT(id) , nom from tblexpediteurs;" ,(err , result) =>
    {
         if(err){
           console.log(err);
         }
         else{
           res.send(result);
         }
    })
})


// app.post("/Clientval",(req , res)=>{
    
//   const date = req.body.date;
//   const datefrom = req.body.datefrom;
//   const dateto = req.body.dateto;
//   const id = req.body.id;


// if(datefrom=="" || dateto=="")
// {

// db.query("Select  COUNT(*) as 'NBcolis', SUM(crbt) as 'CRBT' , SUM(frais) as 'FRAIS'  , SUM(CASE WHEN status_id=2 then frais ELSE NULL END)  as 'Livre' , SUM(CASE WHEN status_id=13 then frais ELSE NULL END)  as 'Retourner a lagence' , SUM(CASE WHEN status_id=9 then frais ELSE NULL END)  as 'refuser' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ? AND id_expediteur =?;",[date ,id ],(err,result)=>{
//     if(err)
//     {
//         console.log(err);

//     }
//     else
//     {
//         res.send(result);
//     }
// })

// }
// else{


// db.query("Select  COUNT(*) as 'NBcolis', SUM(crbt) as 'CRBT' , SUM(frais) as 'FRAIS'  , SUM(CASE WHEN status_id=2 then frais ELSE NULL END)  as 'Livre' , SUM(CASE WHEN status_id=13 then frais ELSE NULL END)  as 'Retourner a lagence' , SUM(CASE WHEN status_id=9 then frais ELSE NULL END)  as 'refuser' FROM tblcolis WHERE  id_expediteur =? AND date_ramassage BETWEEN  ? and ? ",[id , datefrom , dateto],(err,result)=>{
//   if(err)
//   {
//       console.log(err);

//   }
//   else
//   {
//       res.send(result);
//   }

// })
// }



// })


app.post("/Sumvalue",(req , res)=>{
    
  const date = req.body.date;
  const datefrom = req.body.datefrom;
  const dateto = req.body.dateto;

if(datefrom=="" || dateto=="")
{

db.query("Select  COUNT(*) as 'NBcolis', SUM(crbt) as 'CRBT' , SUM(frais) as 'FRAIS'  , SUM(CASE WHEN status_id=2 then frais ELSE NULL END)  as 'Livre' , SUM(CASE WHEN status_id=13 then frais ELSE NULL END)  as 'Retourner a lagence' , SUM(CASE WHEN status_id=9 then frais ELSE NULL END)  as 'refuser' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ?;",[date],(err,result)=>{
    if(err)
    {
        console.log(err);

    }
    else
    {
        res.send(result);
    }
})

}
else{



  
db.query("Select  COUNT(*) as 'NBcolis', SUM(crbt) as 'CRBT' , SUM(frais) as 'FRAIS'  , SUM(CASE WHEN status_id=2 then frais ELSE NULL END)  as 'Livre' , SUM(CASE WHEN status_id=13 then frais ELSE NULL END)  as 'Retourner a lagence' , SUM(CASE WHEN status_id=9 then frais ELSE NULL END)  as 'refuser' FROM tblcolis WHERE date_ramassage BETWEEN  ? and ? ",[datefrom , dateto],(err,result)=>{
  if(err)
  {
      console.log(err);

  }
  else
  {
      res.send(result);
  }

})
}



})

app.get("/loadotherstatus",(req , res)=>{
  db.query("SELECT id , name  FROM tblstatuscolis ",(err,result)=>{

    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }

  })
})

app.post("/SimpleRadialBarChart", (req, res) => {
  const datefrom = req.body.datefrom;
  const dateto = req.body.dateto;
  const date = req.body.date;
  const selectstatu = req.body.selectstatu;
  const id = req.body.id;
  if(id=="")
  {
    if(selectstatu.length > 0)
    {
      if(dateto=="" || datefrom=="")
      {
            db.query(
              "select s.name  as 'nameStatus' ,  c.status_id , (SELECT count(*) from tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ?) as 'NBtotal'  , count(*) as 'NBstatu' from tblcolis c INNER JOIN  tblstatuscolis s ON c.status_id=s.id WHERE DATEDIFF(NOW(),c.date_ramassage) <= ? GROUP by c.status_id;",[date,date],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send(result);
                }
              }
            );
     
  
      }
  
      else
      {
  
        db.query(
          "select s.name  as 'nameStatus' ,  c.status_id , (SELECT count(*) from tblcolis WHERE c.date_ramassage BETWEEN  ? and ?) as 'NBtotal'  , count(*) as 'NBstatu' from tblcolis c INNER JOIN  tblstatuscolis s ON c.status_id=s.id WHERE c.date_ramassage BETWEEN  ? and ? GROUP by c.status_id",[datefrom , dateto , datefrom , dateto],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          }
        );
  
      }
   
    }
  
  
    else
    {
  
    if(dateto=="" || datefrom=="" )
    {
  
          db.query(
            " Select COUNT(*) as 'count' , ((COUNT(*)/ COUNT(*))*100) as 'NBcolis' ,COUNT(CASE WHEN status_id=2 then 1 ELSE NULL END) as 'Count_livre', ((COUNT(CASE WHEN status_id=2 then 1 ELSE NULL END)/COUNT(*))*100) as 'Livre' , COUNT(CASE WHEN status_id=13 then 1 ELSE NULL END) as 'Count_retourn', ((COUNT(CASE WHEN status_id=13 then 1 ELSE NULL END)/COUNT(*))*100) as 'Retourner a lagence' , COUNT(CASE WHEN status_id!=13 AND status_id!=2  AND status_id!=4 then 1 ELSE NULL END) as 'Count_other',((COUNT(CASE WHEN status_id!=13 AND status_id!=2 AND status_id!=4  then 1 ELSE NULL END)/COUNT(*))*100) as 'Other Status' ,  COUNT(CASE WHEN status_id=4 then 1 ELSE NULL END) as 'Count_Expedie', ((COUNT(CASE WHEN status_id=4 then 1  ELSE NULL END)/COUNT(*))*100) as 'Expedie' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ?;",[date],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
    }
    else{
        db.query(
        "Select COUNT(*) as 'count' , ((COUNT(*)/ COUNT(*))*100) as 'NBcolis' ,COUNT(CASE WHEN status_id=2 then 1 ELSE NULL END) as 'Count_livre', ((COUNT(CASE WHEN status_id=2 then 1 ELSE NULL END)/COUNT(*))*100) as 'Livre' , COUNT(CASE WHEN status_id=13 then 1 ELSE NULL END) as 'Count_retourn', ((COUNT(CASE WHEN status_id=13 then 1 ELSE NULL END)/COUNT(*))*100) as 'Retourner a lagence' , COUNT(CASE WHEN status_id!=13 AND status_id!=2  AND status_id!=4 then 1 ELSE NULL END) as 'Count_other',((COUNT(CASE WHEN status_id!=13 AND status_id!=2 AND status_id!=4  then 1 ELSE NULL END)/COUNT(*))*100) as 'Other Status' ,  COUNT(CASE WHEN status_id=4 then 1 ELSE NULL END) as 'Count_Expedie', ((COUNT(CASE WHEN status_id=4 then 1  ELSE NULL END)/COUNT(*))*100) as 'Expedie' FROM tblcolis WHERE date_ramassage BETWEEN  ? and ?;",[datefrom , dateto],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        }
      );
  
    }
  
  
    }
  }
  // where id 
  else{
      if(selectstatu.length > 0)
  {
    if(dateto=="" || datefrom=="")
    {
          db.query(
            "select s.name  as 'nameStatus' ,  c.status_id , (SELECT count(*) from tblcolis WHERE id_expediteur=? AND DATEDIFF(NOW(),date_ramassage) <= ?) as 'NBtotal'  , count(*) as 'NBstatu' from tblcolis c INNER JOIN  tblstatuscolis s ON c.status_id=s.id WHERE c.id_expediteur=? AND DATEDIFF(NOW(),c.date_ramassage) <= ? GROUP by c.status_id;",[id,date,id,date],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
   

    }

    else
    {

      db.query(
        "select s.name  as 'nameStatus' ,  c.status_id , (SELECT count(*) from tblcolis WHERE id_expediteur=? AND c.date_ramassage BETWEEN  ? and ?) as 'NBtotal'  , count(*) as 'NBstatu' from tblcolis c INNER JOIN  tblstatuscolis s ON c.status_id=s.id WHERE  c.id_expediteur=? AND c.date_ramassage BETWEEN  ? and ? GROUP by c.status_id",[id , datefrom , dateto , id ,  datefrom , dateto],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        }
      );

    }
 
  }


  else
  {

  if(dateto=="" || datefrom=="" )
  {

        db.query(
          " Select COUNT(*) as 'count' , ((COUNT(*)/ COUNT(*))*100) as 'NBcolis' ,COUNT(CASE WHEN status_id=2 then 1 ELSE NULL END) as 'Count_livre', ((COUNT(CASE WHEN status_id=2 then 1 ELSE NULL END)/COUNT(*))*100) as 'Livre' , COUNT(CASE WHEN status_id=13 then 1 ELSE NULL END) as 'Count_retourn', ((COUNT(CASE WHEN status_id=13 then 1 ELSE NULL END)/COUNT(*))*100) as 'Retourner a lagence' , COUNT(CASE WHEN status_id!=13 AND status_id!=2  AND status_id!=4 then 1 ELSE NULL END) as 'Count_other',((COUNT(CASE WHEN status_id!=13 AND status_id!=2 AND status_id!=4  then 1 ELSE NULL END)/COUNT(*))*100) as 'Other Status' ,  COUNT(CASE WHEN status_id=4 then 1 ELSE NULL END) as 'Count_Expedie', ((COUNT(CASE WHEN status_id=4 then 1  ELSE NULL END)/COUNT(*))*100) as 'Expedie' FROM tblcolis WHERE id_expediteur=? AND DATEDIFF(NOW(),date_ramassage) <= ?;",[id , date],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          }
        );
  }
  else{
      db.query(
      "Select COUNT(*) as 'count' , ((COUNT(*)/ COUNT(*))*100) as 'NBcolis' ,COUNT(CASE WHEN status_id=2 then 1 ELSE NULL END) as 'Count_livre', ((COUNT(CASE WHEN status_id=2 then 1 ELSE NULL END)/COUNT(*))*100) as 'Livre' , COUNT(CASE WHEN status_id=13 then 1 ELSE NULL END) as 'Count_retourn', ((COUNT(CASE WHEN status_id=13 then 1 ELSE NULL END)/COUNT(*))*100) as 'Retourner a lagence' , COUNT(CASE WHEN status_id!=13 AND status_id!=2  AND status_id!=4 then 1 ELSE NULL END) as 'Count_other',((COUNT(CASE WHEN status_id!=13 AND status_id!=2 AND status_id!=4  then 1 ELSE NULL END)/COUNT(*))*100) as 'Other Status' ,  COUNT(CASE WHEN status_id=4 then 1 ELSE NULL END) as 'Count_Expedie', ((COUNT(CASE WHEN status_id=4 then 1  ELSE NULL END)/COUNT(*))*100) as 'Expedie' FROM tblcolis WHERE id_expediteur=? AND date_ramassage BETWEEN  ? and ?;",[id , datefrom , dateto],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );

  }


  }
  }



});

// --------------SakesareaCharts ----------------------

app.post("/ClientCRBT_data", (req, res) => {
  const date = req.body.date;
  const datefrom = req.body.datefrom;
  const dateto = req.body.dateto;
  const id = req.body.id;

if(datefrom==""  || dateto=="" )
{


if (date == 365) {
    db.query(
      "select MONTHNAME(date_ramassage) as 'Filter',SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE id_expediteur=? AND DATEDIFF(NOW(),date_ramassage) <= 365 GROUP BY Filter ORDER BY date_ramassage ASC;",[id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } 
  else if (date == 30) {
    db.query(
      "select DAY(date_ramassage) as day , MONTH(date_ramassage) as month , CASE WHEN DAY(date_ramassage) <7 AND DAY(date_ramassage)>=1 THEN 'S1' WHEN DAY(date_ramassage) <14 AND DAY(date_ramassage)>=7 THEN 'S2' WHEN DAY(date_ramassage) <21 AND DAY(date_ramassage)>=14 THEN 'S3' WHEN DAY(date_ramassage) <28 AND DAY(date_ramassage)>=1 THEN 'S4' WHEN DAY(date_ramassage) <=30 AND DAY(date_ramassage)>=28 THEN 'S5' END as 'Filter' , SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE id_expediteur=? AND DATEDIFF(NOW(),date_ramassage) <= 30 GROUP BY Filter ORDER BY date_ramassage ASC;",[id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } else if (date == 1) {
    db.query(
      "select date_ramassage , DAY(date_ramassage) as day, HOUR(date_ramassage) as 'Filter',SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE id_expediteur=? AND DATEDIFF(NOW(),date_ramassage) <= 1 GROUP BY day , Filter ORDER by date_ramassage ASC;",[id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } else {
    db.query(
      "select DAYNAME(date_ramassage) as 'Filter',SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE  id_expediteur=? AND DATEDIFF(NOW(),date_ramassage) <= 7 AND DATE_FORMAT(date_ramassage, '%Y-%m-%d')!= DATE_FORMAT(NOW(), '%Y-%m-%d') GROUP BY Filter Order by date_ramassage ASC;",[id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }

}
else{

  db.query(
    "select date_ramassage , DAY(date_ramassage) as day , MONTH(date_ramassage) as month , YEAR(date_ramassage) as year, DAYNAME(date_ramassage) as 'Filter',SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE  id_expediteur=? AND  date_ramassage BETWEEN ? and ? GROUP BY year , month , day ORDER BY date_ramassage ASC",[id , datefrom , dateto],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );


  
}
  
});

app.post("/FilterdateCRBT", (req, res) => {
  const date = req.body.date;
  const datefrom = req.body.datefrom;
  const dateto = req.body.dateto;

if(datefrom==""  || dateto=="" )
{


if (date == 365) {
    db.query(
      "select MONTHNAME(date_ramassage) as 'Filter',SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= 365 GROUP BY Filter ORDER BY date_ramassage ASC;",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } 
  else if (date == 30) {
    db.query(
      "select DAY(date_ramassage) as day , MONTH(date_ramassage) as month , CASE WHEN DAY(date_ramassage) <7 AND DAY(date_ramassage)>=1 THEN 'S1' WHEN DAY(date_ramassage) <14 AND DAY(date_ramassage)>=7 THEN 'S2' WHEN DAY(date_ramassage) <21 AND DAY(date_ramassage)>=14 THEN 'S3' WHEN DAY(date_ramassage) <28 AND DAY(date_ramassage)>=1 THEN 'S4' WHEN DAY(date_ramassage) <=30 AND DAY(date_ramassage)>=28 THEN 'S5' END as 'Filter' , SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= 30 GROUP BY Filter ORDER BY date_ramassage ASC;",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } else if (date == 1) {
    db.query(
      "select date_ramassage , DAY(date_ramassage) as day, HOUR(date_ramassage) as 'Filter',SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= 1 GROUP BY day , Filter ORDER by date_ramassage ASC;",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } else {
    db.query(
      "select DAYNAME(date_ramassage) as 'Filter',SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= 7 AND DATE_FORMAT(date_ramassage, '%Y-%m-%d')!= DATE_FORMAT(NOW(), '%Y-%m-%d') GROUP BY Filter Order by date_ramassage ASC;",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }

}
else{

  db.query(
    "select date_ramassage , DAY(date_ramassage) as day , MONTH(date_ramassage) as month , YEAR(date_ramassage) as year, DAYNAME(date_ramassage) as 'Filter',SUM(crbt) as 'CRBT' , SUM(frais) AS 'FRAIS' , sum(CASE WHEN status_id = 13 THEN FRAIS else 0 end) as 'Retourner a lagence',sum(CASE WHEN status_id = 2 THEN FRAIS else 0 end) as 'livré', sum(CASE WHEN status_id = 9 THEN FRAIS else 0 end) as 'refuse' from tblcolis WHERE date_ramassage BETWEEN ? and ? GROUP BY year , month , day ORDER BY date_ramassage ASC",[datefrom , dateto],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );


  
}
  
});



//------load data select ----------------
app.post('/loadselect',(req , res) => {
  const date =  req.body.date;
  const option =  req.body.option;
 


  if(option == "Villes" )
   {
      db.query("SELECT id as 'value' , name  FROM tblvilles" ,[date], (err,result) => {
          if(err)
          {
              console.log(err);
              
          }
          else
          {
              res.send(result);
          }
         })
   }
   else if (option == "Livreurs")
   {
      db.query("SELECT staffid as 'value' , CONCAT( lastname,' ', firstname) as 'name' from tblstaff where role=1;" ,[date], (err,result) => {
          if(err)
          {
              console.log(err);
              
          }
          else
          {
              res.send(result);
          }
         })
   }
   else
   {
      db.query("SELECT id as 'value' , nom as 'name' from tblexpediteurs;" ,[date], (err,result) => {
          if(err)
          {
              console.log(err);
              
          }
          else
          {
              res.send(result);
          }
      })
   }
   
  

})


// ---------chart general -----------------
app.post('/Data_Pieglobal',(req , res) => {
  const option =  req.body.option;
  const date =  req.body.date;
  const choix =  req.body.choix;

    if(option == "Villes" )
    {
       if(choix == "vide"){ 
           db.query("SELECT v.name 'VILLE' , COUNT(*) as 'NBcolis' from tblcolis c INNER JOIN tblvilles v ON  v.id = c.ville WHERE DATEDIFF(NOW(),date_ramassage) <= ? group by VILLE   ORDER BY NBcolis DESC LIMIT 15;" ,[date], (err,result) => {
          if(err)
          {
              console.log(err);
              
          }
          else
          {
              res.send(result);
          }
         })

       }
       else
       {
         db.query("SELECT v.name 'VILLE' , COUNT(*) as 'NBcolis' from tblcolis c INNER JOIN tblvilles v ON  v.id = c.ville  WHERE DATEDIFF(NOW(),date_ramassage) <= ?    and c.ville = ?" ,[date , choix], (err,result) => {
             if(err)
             {
                 console.log(err);
                 
             }
             else
             {
                 res.send(result);
             }
            })

       }
    }

    else  if(option == "Livreurs" )
    {

        if(choix == "vide")
        {
                 db.query("SELECT  s.lastname as 'LIVREUR' ,  COUNT(*) as 'NBcolis' from tblcolis c INNER JOIN tblstaff s ON s.staffid = c.livreur   WHERE DATEDIFF(NOW(),c.date_ramassage) <= ?  group by  s.lastname ORDER BY NBcolis DESC LIMIT 15  ;" ,[date], (err,result) => {
                   if(err)
                   {
                       console.log(err);
                       
                   }
                   else
                   {
                       res.send(result);
                   }
               })
        }
        else
        {
           db.query("SELECT  s.lastname as 'LIVREUR' ,  COUNT(*) as 'NBcolis' from tblcolis c INNER JOIN tblstaff s ON s.staffid = c.livreur   WHERE DATEDIFF(NOW(),c.date_ramassage) <= ? AND  c.livreur = ? " ,[date , choix], (err,result) => {
               if(err)
               {
                   console.log(err);
                   
               }
               else
               {
                   res.send(result);
               }
           })
        }


    
    }

    else
    {

               if(choix=="vide")
         {

           db.query("SELECT x.nom as 'CLIENTS' , COUNT(*) as 'NBcolis' from tblcolis c INNER JOIN tblexpediteurs x ON x.id = c.id_expediteur WHERE DATEDIFF(NOW(),date_ramassage) <= ? group by CLIENTS ORDER BY NBcolis DESC LIMIT 15;" ,[date], (err,result) => {
               if(err)
               {
                   console.log(err);
                   
               }
               else
               {
                   res.send(result);
               }
              })

         }
         else
         { 
              db.query("SELECT x.nom as 'CLIENTS'  , COUNT(*) as 'NBcolis' from tblcolis c INNER JOIN tblexpediteurs x ON x.id = c.id_expediteur  WHERE DATEDIFF(NOW(),date_ramassage) <= ? and c.id_expediteur = ? ;  " ,[date, choix], (err,result) => {
            if(err)
            {
                console.log(err);
                
            }
            else
            {
                res.send(result);
            }
           })


         }

      


    }
  

})

// pie status
app.post('/Data_Piestatus',(req , res) => {
  const option =  req.body.option;
  const date =  req.body.date;
  const choix =  req.body.choix;

    if(option == "Villes" )
    {
        if(choix == "vide"){ 
            db.query("SELECT COUNT(CASE WHEN status_id= 4 then 1 ELSE NULL END) as 'expedie', COUNT(CASE WHEN status_id = 104 then 1 ELSE NULL END) as 'Reception', COUNT(CASE WHEN status_id = 5 then 1 ELSE NULL END) as 'Ramasse', COUNT(CASE WHEN status_id = 11 then 1 ELSE NULL END) as 'Reporte', COUNT(CASE WHEN status_id = 13 then 1 ELSE NULL END) as 'Retourner a lagence', COUNT(CASE WHEN status_id = 2 then 1 ELSE NULL END) as 'Livre' , COUNT(CASE WHEN status_id = 6 then 1 ELSE NULL END) as 'Pas de reponse' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ?;" ,[date], (err,result) => {
           if(err)
           {
               console.log(err);
               
           }
           else
           {
               res.send(result);
           }
          })

        }
        else
        {
          db.query("SELECT COUNT(CASE WHEN status_id= 4 then 1 ELSE NULL END) as 'expedie', COUNT(CASE WHEN status_id = 104 then 1 ELSE NULL END) as 'Reception', COUNT(CASE WHEN status_id = 5 then 1 ELSE NULL END) as 'Ramasse', COUNT(CASE WHEN status_id = 11 then 1 ELSE NULL END) as 'Reporte', COUNT(CASE WHEN status_id = 13 then 1 ELSE NULL END) as 'Retourner a lagence', COUNT(CASE WHEN status_id = 2 then 1 ELSE NULL END) as 'Livre' , COUNT(CASE WHEN status_id = 6 then 1 ELSE NULL END) as 'Pas de reponse' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ? and  ville = ?;" ,[date , choix], (err,result) => {
              if(err)
              {
                  console.log(err);
                  
              }
              else
              {
                  res.send(result);
              }
             })

        }
       


      
    }

    else  if(option == "Livreurs" )
    {

        if(choix == "vide")
        {
                 db.query("SELECT COUNT(CASE WHEN status_id= 4 then 1 ELSE NULL END) as 'expedie', COUNT(CASE WHEN status_id = 104 then 1 ELSE NULL END) as 'Reception', COUNT(CASE WHEN status_id = 5 then 1 ELSE NULL END) as 'Ramasse', COUNT(CASE WHEN status_id = 11 then 1 ELSE NULL END) as 'Reporte', COUNT(CASE WHEN status_id = 13 then 1 ELSE NULL END) as 'Retourner a lagence', COUNT(CASE WHEN status_id = 2 then 1 ELSE NULL END) as 'Livre' , COUNT(CASE WHEN status_id = 6 then 1 ELSE NULL END) as 'Pas de reponse' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ?;" ,[date], (err,result) => {
                   if(err)
                   {
                       console.log(err);
                       
                   }
                   else
                   {
                       res.send(result);
                   }
               })
        }
        else
        {
         
          db.query("SELECT COUNT(CASE WHEN status_id= 4 then 1 ELSE NULL END) as 'expedie', COUNT(CASE WHEN status_id = 104 then 1 ELSE NULL END) as 'Reception', COUNT(CASE WHEN status_id = 5 then 1 ELSE NULL END) as 'Ramasse', COUNT(CASE WHEN status_id = 11 then 1 ELSE NULL END) as 'Reporte', COUNT(CASE WHEN status_id = 13 then 1 ELSE NULL END) as 'Retourner a lagence', COUNT(CASE WHEN status_id = 2 then 1 ELSE NULL END) as 'Livre' , COUNT(CASE WHEN status_id = 6 then 1 ELSE NULL END) as 'Pas de reponse' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ? and  livreur = ?; " ,[date , choix], (err,result) => {
              if(err)
              {
                  console.log(err);
                  
              }
              else
              {
                  res.send(result);
              }
          })
 
       
        }


    
    }


    else  if(option == "Clients" )
    {

        if(choix == "vide")
        {
                 db.query("SELECT COUNT(CASE WHEN status_id= 4 then 1 ELSE NULL END) as 'expedie', COUNT(CASE WHEN status_id = 104 then 1 ELSE NULL END) as 'Reception', COUNT(CASE WHEN status_id = 5 then 1 ELSE NULL END) as 'Ramasse', COUNT(CASE WHEN status_id = 11 then 1 ELSE NULL END) as 'Reporte', COUNT(CASE WHEN status_id = 13 then 1 ELSE NULL END) as 'Retourner a lagence', COUNT(CASE WHEN status_id = 2 then 1 ELSE NULL END) as 'Livre' , COUNT(CASE WHEN status_id = 6 then 1 ELSE NULL END) as 'Pas de reponse' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ?;" ,[date], (err,result) => {
                   if(err)
                   {
                       console.log(err);
                       
                   }
                   else
                   {
                       res.send(result);
                   }
               })
        }
        else
        {
         
          db.query("SELECT COUNT(CASE WHEN status_id= 4 then 1 ELSE NULL END) as 'expedie', COUNT(CASE WHEN status_id = 104 then 1 ELSE NULL END) as 'Reception', COUNT(CASE WHEN status_id = 5 then 1 ELSE NULL END) as 'Ramasse', COUNT(CASE WHEN status_id = 11 then 1 ELSE NULL END) as 'Reporte', COUNT(CASE WHEN status_id = 13 then 1 ELSE NULL END) as 'Retourner a lagence', COUNT(CASE WHEN status_id = 2 then 1 ELSE NULL END) as 'Livre' , COUNT(CASE WHEN status_id = 6 then 1 ELSE NULL END) as 'Pas de reponse' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ? and  id_expediteur = ?;" ,[date , choix], (err,result) => {
              if(err)
              {
                  console.log(err);
                  
              }
              else
              {
                  res.send(result);
              }
          })
 
       
        }


    
    }


    else
    {
        

          db.query("SELECT COUNT(CASE WHEN status_id= 4 then 1 ELSE NULL END) as 'expedie', COUNT(CASE WHEN status_id = 104 then 1 ELSE NULL END) as 'Reception', COUNT(CASE WHEN status_id = 5 then 1 ELSE NULL END) as 'Ramasse', COUNT(CASE WHEN status_id = 11 then 1 ELSE NULL END) as 'Reporte', COUNT(CASE WHEN status_id = 13 then 1 ELSE NULL END) as 'Retourner a lagence', COUNT(CASE WHEN status_id = 2 then 1 ELSE NULL END) as 'Livre' , COUNT(CASE WHEN status_id = 6 then 1 ELSE NULL END) as 'Pas de reponse' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ?; " ,[date], (err,result) => {
              if(err)
              {
                  console.log(err);
                  
              }
              else
              {
                  res.send(result);
              }
             })

    }
  

})


// ---------chart filter ville -----------------

app.post('/Data_Pieville',(req , res) => {
  const option =  req.body.option;
  const date =  req.body.date;
  const choix =  req.body.choix;

    if(option == "Villes" )
    {
        if(choix == "vide"){ 
            db.query("SELECT c.id_expediteur , x.nom as 'CLIENTS' , count(*) AS 'NBcolis'   FROM tblcolis c INNER JOIN tblexpediteurs x ON c.id_expediteur = x.id  WHERE  DATEDIFF(NOW(),c.date_ramassage) <= ?  GROUP BY c.id_expediteur ORDER BY NBcolis DESC;" ,[date], (err,result) => {
           if(err)
           {
               console.log(err);
               
           }
           else
           {
               res.send(result);
           }
          })

        }
        else
        {
          db.query(" SELECT c.id_expediteur , x.nom as 'CLIENTS' , count(*) AS 'NBcolis'   FROM tblcolis c INNER JOIN tblexpediteurs x ON c.id_expediteur = x.id  WHERE   DATEDIFF(NOW(),c.date_ramassage) <= ? AND c.ville = ? GROUP BY c.id_expediteur ORDER BY NBcolis DESC  " ,[date , choix], (err,result) => {
              if(err)
              {
                  console.log(err);
                  
              }
              else
              {
                  res.send(result);
              }
             })

        }
       


      
    }

    else  if(option == "Livreurs" )
    {

        if(choix == "vide")
        {
                 db.query("SELECT v.name as 'VILLE' , count(*) AS 'NBcolis'from tblcolis c INNER JOIN tblvilles v ON v.id = c.ville WHERE DATEDIFF(NOW(),date_ramassage) <= ? GROUP BY VILLE ORDER BY NBcolis DESC; " ,[date], (err,result) => {
                   if(err)
                   {
                       console.log(err);
                       
                   }
                   else
                   {
                       res.send(result);
                   }
               })
        }
        else
        {
         
          db.query("SELECT v.name as 'VILLE' , count(*)  AS 'NBcolis'  from tblcolis c INNER JOIN tblvilles v ON v.id = c.ville  WHERE  DATEDIFF(NOW(),date_ramassage) <= ?  AND c.livreur = ?  GROUP BY VILLE ORDER BY NBcolis DESC;" ,[date , choix], (err,result) => {
              if(err)
              {
                  console.log(err);
                  
              }
              else
              {
                  res.send(result);
              }
          })
 
       
        }


    
    }


    else  if(option == "Clients" )
    {

        if(choix == "vide")
        {
                 db.query("SELECT v.name as 'VILLE' , count(*) AS 'NBcolis' from tblcolis c INNER JOIN tblvilles v ON v.id = c.ville WHERE DATEDIFF(NOW(),date_ramassage) <= ? GROUP BY VILLE ORDER BY NBcolis DESC;" ,[date], (err,result) => {
                   if(err)
                   {
                       console.log(err);
                       
                   }
                   else
                   {
                       res.send(result);
                   }
               })
        }
        else
        {
         
          db.query("SELECT  v.name as 'VILLE' , count(*)  AS 'NBcolis' from tblcolis c INNER JOIN tblvilles v ON v.id = c.ville  WHERE  DATEDIFF(NOW(),c.date_ramassage) <= ? AND c.id_expediteur = ?  GROUP BY VILLE  ORDER BY NBcolis DESC" ,[date , choix], (err,result) => {
              if(err)
              {
                  console.log(err);
                  
              }
              else
              {
                  res.send(result);
              }
          })
 
       
        }


    
    }


    else
    {
        

          db.query("SELECT v.name as 'VILLE' , count(*) AS 'NBcolis' from tblcolis c INNER JOIN tblvilles v ON v.id = c.ville WHERE DATEDIFF(NOW(),date_ramassage) <= 3652 GROUP BY VILLE ORDER BY NBcolis DESC;" ,[date], (err,result) => {
              if(err)
              {
                  console.log(err);
                  
              }
              else
              {
                  res.send(result);
              }
             })

    }
  

})




app.get("/Etat_vercement", (req, res) => {
  db.query(
    "SELECT Dateetat , Total versement FROM etat_colis GROUP BY Dateetat ;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/factur_crbt", (req, res) => {
  db.query(
    "SELECT Date_Création , CRBT  FROM factures_internes  GROUP by Date_Création ;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});



// --------------------cart 1------------
app.get("/cart1",(req,res)=>{

  db.query("SELECT SUM(crbt) as 'CRBT' , SUM(frais) as 'FRAIS' , SUM(frais)  as 'Commission' , COUNT(*) as 'NBcolis', SUM(CASE WHEN DATEDIFF(now(),date_ramassage)<2 AND DAY(date_ramassage)!=DAY(now()) THEN crbt ELSE 0 END) AS 'CRBT_lastday' FROM `tblcolis` WHERE DATEDIFF(NOW(),date_ramassage)<=1;",
  (err,result)=>{
    if(err){
      console.log(err)
    }
    else{
      res.send(result);
    }
  })

})
// --------------------cart 2------------
app.get("/cart2",(req,res)=>{

  db.query("SELECT COUNT(*) as 'Nbdemandes' , COUNT(CASE WHEN status =1 THEN 1 ELSE NULL END) AS 'en_cousr' , COUNT(CASE WHEN status =2 THEN 1 ELSE NULL END) AS 'repondu' , COUNT(CASE WHEN status =3 THEN 1 ELSE NULL END) AS 'repondu_parclient' , COUNT(CASE WHEN status =4 THEN 1 ELSE NULL END) AS 'terminé' , (SELECT COUNT(*) from tbldemandes WHERE DATEDIFF(now(),datecreated)<2 AND DAY(now())!=DAY(datecreated) ) AS 'Nbdemands_lastday' FROM tbldemandes WHERE DATEDIFF(now(),datecreated)<1; ;",
  (err,result)=>{
    if(err){
      console.log(err)
    }
    else{
      res.send(result);
    }
  })

})

// --------------------bon livraison sortie------------

app.post("/chartbonlivraisonsortie",(req,res)=>{
  const date = req.body.date;
  const option = req.body.option;
  const choix =  req.body.choix;

  if(option == "Livreurs"){

    if(choix=="vide")
    {
           db.query("SELECT b.id_livreur ,  (SELECT CONCAT(s.firstname, ' ', s.lastname) from tblstaff s WHERE s.staffid = b.id_livreur ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE DATEDIFF(now(),b.date_created)<=? AND b.type=1 GROUP BY b.id_livreur  ORDER by NBbon_livraison DESC",[date],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
    }
    else{
      db.query("SELECT (SELECT v.name from tblvilles v WHERE v.id = c.ville ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE b.id_livreur=? AND DATEDIFF(now(),b.date_created)<=? AND b.type=1 GROUP BY name  ORDER by NBbon_livraison DESC",[choix , date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }

 
  }
  else if (option == "Clients"){
    if(choix=="vide"){
          db.query("SELECT (SELECT x.nom from tblexpediteurs x WHERE x.id = c.id_expediteur ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE  DATEDIFF(now(),b.date_created)<=? AND b.type=1 GROUP BY name  ORDER by NBbon_livraison DESC",[date],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
    }
    else{

      db.query("SELECT (SELECT v.name from tblvilles v WHERE v.id = c.ville ) AS 'name' , COUNT(*) as 'NBbon_livraison' from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison WHERE c.id_expediteur=? AND DATEDIFF(now(),b.date_created)<=? AND b.type=1 GROUP BY name;",[choix , date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })

    }

  }
  else
  {
    if(choix=="vide"){

       db.query("SELECT (SELECT v.name from tblvilles v WHERE c.ville = v.id ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE  DATEDIFF(now(),b.date_created)<=? AND b.type=1 GROUP BY name  ORDER by NBbon_livraison DESC",[date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }
    else
    {

      db.query("SELECT (SELECT CONCAT(s.firstname, ' ', s.lastname) from tblstaff s WHERE s.staffid = b.id_livreur ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE c.ville = ? AND DATEDIFF(now(),b.date_created)<=? AND b.type=1  GROUP BY b.id_livreur  ORDER by NBbon_livraison DESC",[choix , date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }
   
  }
  

})


// Bond livraison retourné

app.post("/chartbonlivraisonretourne",(req,res)=>{
  const date = req.body.date;
  const option = req.body.option;
  const choix =  req.body.choix;

  if(option == "Livreurs"){

    if(choix=="vide")
    {
           db.query("SELECT b.id_livreur ,  (SELECT CONCAT(s.firstname, ' ', s.lastname) from tblstaff s WHERE s.staffid = b.id_livreur ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE DATEDIFF(now(),b.date_created)<=? AND b.type=2 GROUP BY b.id_livreur  ORDER by NBbon_livraison DESC",[date],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
    }
    else{
      db.query("SELECT (SELECT v.name from tblvilles v WHERE v.id = c.ville ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE b.id_livreur=? AND DATEDIFF(now(),b.date_created)<=? AND b.type=2 GROUP BY name  ORDER by NBbon_livraison DESC",[choix , date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }

 
  }
  else if (option == "Clients"){
    if(choix=="vide"){
          db.query("SELECT (SELECT x.nom from tblexpediteurs x WHERE x.id = c.id_expediteur ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE  DATEDIFF(now(),b.date_created)<=? AND b.type=2 GROUP BY name  ORDER by NBbon_livraison DESC",[date],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
    }
    else{

      db.query("SELECT (SELECT v.name from tblvilles v WHERE v.id = c.ville ) AS 'name' , COUNT(*) as 'NBbon_livraison' from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison WHERE c.id_expediteur=? AND DATEDIFF(now(),b.date_created)<=? AND b.type=2 GROUP BY name;",[choix , date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })

    }

  }
  else
  {
    if(choix=="vide"){

       db.query("SELECT (SELECT v.name from tblvilles v WHERE c.ville = v.id ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE  DATEDIFF(now(),b.date_created)<=? AND b.type=2 GROUP BY name  ORDER by NBbon_livraison DESC",[date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }
    else
    {

      db.query("SELECT (SELECT CONCAT(s.firstname, ' ', s.lastname) from tblstaff s WHERE s.staffid = b.id_livreur ) AS 'name' ,   COUNT(*) as 'NBbon_livraison'  from tblcolis c INNER JOIN tblbonlivraison b ON b.id = c.num_bonlivraison  WHERE c.ville = ? AND DATEDIFF(now(),b.date_created)<=? AND b.type=2  GROUP BY b.id_livreur  ORDER by NBbon_livraison DESC",[choix , date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }
   
  }
  

})








// --------------------Demende ramasssage------------

app.post("/chartdemande_ramassage",(req,res)=>{
  const date = req.body.date;
  const option = req.body.option;
  const choix = req.body.choix;


  if(option == "Clients")
  {
    if(choix=="vide"){

          db.query("SELECT COUNT(*) as 'count' , d.client_id , x.nom 'Filter' FROM tbldemandes d INNER JOIN tblexpediteurs x ON x.id=d.client_id  WHERE  DATEDIFF(now(),d.datecreated)<= ?  GROUP by  d.client_id ORDER by count DESC",[date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }
    else{
      if(date == 30){
        db.query("SELECT COUNT(*) as 'count' , CASE WHEN DAY(d.datecreated) <7 AND DAY(d.datecreated)>=1 THEN 'S1' WHEN DAY(d.datecreated) <14 AND DAY(d.datecreated)>=7 THEN 'S2' WHEN DAY(d.datecreated) <21 AND DAY(d.datecreated)>=14 THEN 'S3' WHEN DAY(d.datecreated) <28 AND DAY(d.datecreated)>=1 THEN 'S4' WHEN DAY(d.datecreated) <=30 AND DAY(d.datecreated)>=28 THEN 'S5' END as 'Filter' FROM tbldemandes d INNER JOIN tblexpediteurs x ON x.id=d.client_id WHERE d.client_id=? AND DATEDIFF(now(),d.datecreated)<= 30 GROUP by Filter ORDER by d.datecreated DESC;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else if(date==7){
        db.query("SELECT d.datecreated , COUNT(*) as 'count' , DAYNAME(d.datecreated) as 'Filter' FROM tbldemandes d INNER JOIN tblexpediteurs x ON x.id=d.client_id WHERE d.client_id=? AND DATEDIFF(now(),d.datecreated)<= 7 GROUP by Filter ORDER by d.datecreated DESC;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else if (date==1){
        db.query("SELECT d.datecreated , COUNT(*) as 'count' , HOUR(d.datecreated) AS 'Filter' FROM tbldemandes d INNER JOIN tblexpediteurs x ON x.id=d.client_id WHERE d.client_id=? AND DATEDIFF(now(),d.datecreated)<= 1 GROUP by Filter ORDER by d.datecreated DESC;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else{
        db.query("SELECT d.datecreated , COUNT(*) as 'count' , MONTHNAME(d.datecreated) AS 'Filter' FROM tbldemandes d INNER JOIN tblexpediteurs x ON x.id=d.client_id WHERE d.client_id=? AND DATEDIFF(now(),d.datecreated)<= 365 GROUP by Filter ORDER by d.datecreated DESC;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
  
    }
 
  }

  else   if(option == "Livreurs")
  {
    if(choix=="vide"){

          db.query("SELECT COUNT(*) as 'count' , d.collector , CONCAT(s.firstname, ' ', s.lastname) as  'Filter' FROM tbldemandes d INNER JOIN tblstaff s ON s.staffid=d.collector  WHERE DATEDIFF(now(),d.datecreated)<= ? GROUP by  d.collector ORDER by count DESC",[date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }
    else{
      if(date == 30){
        db.query("SELECT COUNT(*) as 'count' , CASE WHEN DAY(d.datecreated) <7 AND DAY(d.datecreated)>=1 THEN 'S1' WHEN DAY(d.datecreated) <14 AND DAY(d.datecreated)>=7 THEN 'S2' WHEN DAY(d.datecreated) <21 AND DAY(d.datecreated)>=14 THEN 'S3' WHEN DAY(d.datecreated) <28 AND DAY(d.datecreated)>=1 THEN 'S4' WHEN DAY(d.datecreated) <=30 AND DAY(d.datecreated)>=28 THEN 'S5' END as 'Filter' from tbldemandes d WHERE d.collector = ? AND DATEDIFF(now(),d.datecreated)<= 30 GROUP BY Filter ORDER by d.datecreated DESC;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else if(date==7){
        db.query("SELECT COUNT(*) as 'count' , DAYNAME(d.datecreated) as 'Filter' from tbldemandes d WHERE d.collector = ? AND DATEDIFF(now(),d.datecreated)<= 7 GROUP BY Filter ORDER by d.datecreated DESC;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else if (date==1){
        db.query("SELECT COUNT(*) as 'count' , HOUR(d.datecreated) as 'Filter' from tbldemandes d WHERE d.collector = ? AND DATEDIFF(now(),d.datecreated)<= 1 GROUP BY Filter ORDER by d.datecreated DESC ;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else{
        db.query("SELECT COUNT(*) as 'count' , MONTHNAME(d.datecreated) as 'Filter' from tbldemandes d WHERE d.collector = ? AND DATEDIFF(now(),d.datecreated)<= 365 GROUP BY Filter ORDER by d.datecreated DESC;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
  
    }
  
  }

  else {

    if(choix=="vide")
    {
      
      db.query("SELECT COUNT(*) as 'count' , d.collector , (SELECT name from tblvilles WHERE id = d.collector) as  'Filter' FROM tbldemandes d INNER JOIN tblstaff s ON s.staffid=d.collector  WHERE DATEDIFF(now(),d.datecreated)<= ? GROUP by  d.collector ORDER by count DESC",[date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
      })
    }
    else{
      if(date == 30){
        db.query("SELECT COUNT(*) as 'count' , CASE WHEN DAY(d.datecreated) <7 AND DAY(d.datecreated)>=1 THEN 'S1' WHEN DAY(d.datecreated) <14 AND DAY(d.datecreated)>=7 THEN 'S2' WHEN DAY(d.datecreated) <21 AND DAY(d.datecreated)>=14 THEN 'S3' WHEN DAY(d.datecreated) <28 AND DAY(d.datecreated)>=1 THEN 'S4' WHEN DAY(d.datecreated) <=30 AND DAY(d.datecreated)>=28 THEN 'S5' END as 'Filter' FROM tbldemandes d INNER JOIN tblstaff s ON s.staffid=d.collector INNER JOIN tblvilles v ON s.city = v.id WHERE v.id=? AND DATEDIFF(now(),d.datecreated)<= 30 GROUP by Filter ORDER BY count DESC;;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else if(date==7){
        db.query("SELECT COUNT(*) as 'count' , DAYNAME(d.datecreated) as 'Filter' FROM tbldemandes d INNER JOIN tblstaff s ON s.staffid=d.collector INNER JOIN tblvilles v ON s.city = v.id WHERE v.id=? AND DATEDIFF(now(),d.datecreated)<= 7 GROUP by Filter ORDER BY count DESC;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else if (date==1){
        db.query("SELECT COUNT(*) as 'count' , HOUR(d.datecreated) as 'Filter' FROM tbldemandes d INNER JOIN tblstaff s ON s.staffid=d.collector INNER JOIN tblvilles v ON s.city = v.id WHERE v.id=? AND DATEDIFF(now(),d.datecreated)<= 365 GROUP by Filter ORDER BY count DESC;;",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else{
        db.query("SELECT COUNT(*) as 'count' , MONTHNAME(d.datecreated) as 'Filter' FROM tbldemandes d INNER JOIN tblstaff s ON s.staffid=d.collector INNER JOIN tblvilles v ON s.city = v.id WHERE v.id=? AND DATEDIFF(now(),d.datecreated)<= 365 GROUP by Filter ORDER BY count DESC; ",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
  
    }
  

  }

 

})


// --------------------chartrelve_retourne------------

app.post("/chartrelve_retourne",(req,res)=>{

  const date = req.body.date;
  const option = req.body.option;
  const choix = req.body.choix;

  
  if(option == "Clients")
  {
    if(choix=="vide"){

            db.query("SELECT COUNT(*) as 'count' , f.id_expediteur , x.nom as 'Filter'  FROM tblfactures f INNER JOIN tblexpediteurs x ON f.id_expediteur = x.id  WHERE  DATEDIFF(now(),f.date_created)<=? GROUP BY  f.id_expediteur ORDER by count DESC",[date],
          (err,result)=>{
            if(err){
              console.log(err)
            }
            else{
              res.send(result);
            }
            })
    }
    else{
       
           if (date==30){
                db.query("SELECT     CASE WHEN DAY(f.date_created) <7 AND DAY(f.date_created)>=1 THEN 'S1' WHEN DAY(f.date_created) <14 AND DAY(f.date_created)>=7 THEN 'S2' WHEN DAY(f.date_created) <21 AND DAY(f.date_created)>=14 THEN 'S3' WHEN DAY(f.date_created) <28 AND DAY(f.date_created)>=1 THEN 'S4' WHEN DAY(f.date_created) <=30 AND DAY(f.date_created)>=28 THEN 'S5' END as 'Filter' ,  COUNT(*) as 'count'     FROM tblfactures f INNER JOIN tblexpediteurs x ON f.id_expediteur = x.id  WHERE  f.id_expediteur = ? AND DATEDIFF(now(),f.date_created)<=30 GROUP BY  Filter ORDER by f.date_created  DESC",[choix],
                (err,result)=>{
                  if(err){
                    console.log(err)
                  }
                  else{
                    res.send(result);
                  }
              })
          }

          else if (date==7){

              db.query("SELECT   DAYNAME(f.date_created)   as 'Filter' ,  COUNT(*) as 'count'     FROM tblfactures f INNER JOIN tblexpediteurs x ON f.id_expediteur = x.id  WHERE  f.id_expediteur = ? AND DATEDIFF(now(),f.date_created)<=7 GROUP BY  Filter ORDER by f.date_created  DESC",[choix],
              (err,result)=>{
                if(err){
                  console.log(err)
                }
                else{
                  res.send(result);
                }
            })
          }

          else if(date==1){

            db.query("SELECT COUNT(*) as 'count' , HOUR(f.date_created) AS 'Filter'    FROM tblfactures f INNER JOIN tblexpediteurs x ON f.id_expediteur = x.id  WHERE  f.id_expediteur = ? AND DATEDIFF(now(),f.date_created)<=365 GROUP BY  Filter ORDER by f.date_created  DESC",[choix],
              (err,result)=>{
                if(err){
                  console.log(err)
                }
                else{
                  res.send(result);
                }
            })
        }

        else{
          
            db.query("SELECT COUNT(*) as 'count' , MONTHNAME(f.date_created) AS 'Filter'    FROM tblfactures f INNER JOIN tblexpediteurs x ON f.id_expediteur = x.id  WHERE  f.id_expediteur = ? AND DATEDIFF(now(),f.date_created)<=365 GROUP BY  Filter ORDER by count DESC",[choix],
            (err,result)=>{
              if(err){
                console.log(err)
              }
              else{
                res.send(result);
              }
          })
        }
      
     
    }

  }
  else   if(option == "Livreurs")
  {
    if(choix=="vide"){
           db.query("SELECT COUNT(*) as 'count' ,  s.staffid , CONCAT(s.firstname, ' ', s.lastname) as 'Filter'  FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid  WHERE DATEDIFF(now(),f.date_created)<=? GROUP BY  s.staffid ORDER by count DESC",[date],
            (err,result)=>{
              if(err){
                console.log(err)
              }
              else{
                res.send(result);
              }
            })

    }
    else{
      if(date==30)
      {
          db.query("SELECT COUNT(*) as 'count' ,   CASE WHEN DAY(f.date_created) <7 AND DAY(f.date_created)>=1 THEN 'S1' WHEN DAY(f.date_created) <14 AND DAY(f.date_created)>=7 THEN 'S2' WHEN DAY(f.date_created) <21 AND DAY(f.date_created)>=14 THEN 'S3' WHEN DAY(f.date_created) <28 AND DAY(f.date_created)>=1 THEN 'S4' WHEN DAY(f.date_created) <=30 AND DAY(f.date_created)>=28 THEN 'S5' END as 'Filter'   FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid  WHERE f.id_livreur = ? AND DATEDIFF(now(),f.date_created)<=30 GROUP BY  Filter ORDER by f.date_created  DESC",[choix ],
          (err,result)=>{
            if(err){
              console.log(err)
            }
            else{
              res.send(result);
            }
          })

      }
      else if(date==7){
        db.query("SELECT COUNT(*) as 'count' ,   DAYNAME(f.date_created)   as 'Filter'   FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid  WHERE f.id_livreur = ? AND DATEDIFF(now(),f.date_created)<=7 GROUP BY  Filter ORDER by f.date_created  DESC",[choix ],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }

      else if (date ==1)
      {
        db.query("SELECT COUNT(*) as 'count' ,  HOUR(f.date_created) AS 'Filter'   FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid  WHERE f.id_livreur = ? AND DATEDIFF(now(),f.date_created)<=1 GROUP BY  Filter ORDER by f.date_created  DESC",[choix ],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
      else
      {
        db.query("SELECT COUNT(*) as 'count' ,   MONTHNAME(f.date_created) AS 'Filter'    FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid  WHERE f.id_livreur = ? AND DATEDIFF(now(),f.date_created)<=365 GROUP BY  Filter ORDER by f.date_created  DESC",[choix],
        (err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result);
          }
        })
      }
    
    }
    
  }

  else {

    if(choix=="vide"){
      db.query("SELECT COUNT(*) as 'count' ,  s.staffid , (SELECT name from tblvilles WHERE id = f.id_livreur) as 'Filter'  FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid  WHERE DATEDIFF(now(),f.date_created)<=? GROUP BY  s.staffid ORDER by count DESC",[date],
      (err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          res.send(result);
        }
    })

    }
    else{
          if(date==30)
          {
            db.query("SELECT COUNT(*) as 'count' ,   CASE WHEN DAY(f.date_created) <7 AND DAY(f.date_created)>=1 THEN 'S1' WHEN DAY(f.date_created) <14 AND DAY(f.date_created)>=7 THEN 'S2' WHEN DAY(f.date_created) <21 AND DAY(f.date_created)>=14 THEN 'S3' WHEN DAY(f.date_created) <28 AND DAY(f.date_created)>=1 THEN 'S4' WHEN DAY(f.date_created) <=30 AND DAY(f.date_created)>=28 THEN 'S5' END as 'Filter' FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid INNER JOIN tblvilles v ON v.id = s.city WHERE DATEDIFF(now(),f.date_created)<=30 AND v.id=? GROUP BY Filter ORDER by f.date_created DESC;",[choix , date],
              (err,result)=>{
                if(err){
                  console.log(err)
                }
                else{
                  res.send(result);
                }
            })
          }
          else if (date==7){
              db.query("SELECT COUNT(*) as 'count' , DAYNAME(f.date_created) AS 'Filter' FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid INNER JOIN tblvilles v ON v.id = s.city WHERE DATEDIFF(now(),f.date_created)<=7 AND v.id=? GROUP BY Filter ORDER by f.date_created DESC;",[choix],
              (err,result)=>{
                if(err){
                  console.log(err)
                }
                else{
                  res.send(result);
                }
            })
          }
          else if (date==1){
              db.query("SELECT COUNT(*) as 'count' , HOUR(f.date_created) AS 'Filter' FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid INNER JOIN tblvilles v ON v.id = s.city WHERE DATEDIFF(now(),f.date_created)<=1 AND v.id=? GROUP BY Filter ORDER by f.date_created DESC;",[choix],
              (err,result)=>{
                if(err){
                  console.log(err)
                }
                else{
                  res.send(result);
                }
              })
          }
          else{

            db.query("SELECT COUNT(*) as 'count' , MONTHNAME(f.date_created) AS 'Filter' FROM tblfactures f INNER JOIN tblstaff s ON f.id_livreur = s.staffid INNER JOIN tblvilles v ON v.id = s.city WHERE DATEDIFF(now(),f.date_created)<=365 AND v.id=? GROUP BY Filter ORDER by f.date_created DESC;",[choix],
              (err,result)=>{
                if(err){
                  console.log(err)
                }
                else{
                  res.send(result);
                }
            })
          }
   
    }
    
  }
 

})

// ---------Etat colis livré (Facture interne)-----

app.post('/Etatcolislivre',(req , res) => {
 
   const datefrom = req.body.datefrom;
   const dateto = req.body.dateto;

   if(datefrom =="" || dateto =="" )
   {
       db.query("SELECT DATE_FORMAT(date_created, '%Y/%m/%d') as 'day' ,DAYNAME (date_created) as 'Nameday' , SUM(total) - SUM(total_received) as 'Total_No_Verser' , SUM(total_received) as 'Versement' , SUM(total) as 'totalCRBT' FROM tbletatcolislivre WHERE DATEDIFF(NOW(),date_created) < 30 GROUP BY day ORDER BY date_created ASC;",(err,result)=>{
           if(err)
           {
               console.log(err);
     
           }
           else
           {
               res.send(result);
           }
       })
    
   }

   else{
       db.query("SELECT DATE_FORMAT(date_created, '%Y/%m/%d') as 'day' ,DAYNAME (date_created) as 'Nameday' , SUM(total) - SUM(total_received) as 'Total_No_Verser' , SUM(total_received) as 'Versement' , SUM(total) as 'totalCRBT' FROM tbletatcolislivre WHERE date_created BETWEEN  ?  AND  ?  GROUP BY day  ORDER BY date_created ASC",[datefrom , dateto ],(err,result)=>{
           if(err)
           {
               console.log(err);
     
           }
           else
           {
               res.send(result);
           }
       })
   }

})


// --------------Facture intern--------------


app.post('/Facturinterndata',(req , res) => {
 
  const datefrom = req.body.datefrom;
  const dateto = req.body.dateto;

  if(datefrom =="" || dateto =="" )
  {
      db.query("SELECT DATE_FORMAT(date_created, '%Y/%m/%d') as 'day' , DAYNAME (date_created) as 'Nameday' , SUM(total_frais) as 'Frais' , SUM(total_net) as 'Net' , SUM(total_refuse) as 'Refuse' , SUM(total_parrainage) as 'Parrainage' , SUM(total_remise) as 'Remis' FROM `tblfacturesinternes` WHERE DATEDIFF(NOW(),date_created)<7 GROUP BY day ORDER BY date_created DESC;",(err,result)=>{
          if(err)
          {
              console.log(err);
    
          }
          else
          {
                 res.send(result);
          }
      })
   
  }

  else{
      db.query("SELECT DATE_FORMAT(date_created, '%Y/%m/%d') as 'day' , SUM(total_frais) as 'Frais' , SUM(total_net) as 'Net' , SUM(total_refuse) as 'Refuse' , SUM(total_parrainage) as 'Parrainage' , SUM(total_remise) as 'Remis' FROM `tblfacturesinternes`  WHERE date_created BETWEEN ? AND ? GROUP BY day ORDER BY date_created DESC;",[datefrom , dateto ],(err,result)=>{
          if(err)
          {
              console.log(err);
    
          }
          else
          {
              res.send(result);
          }
      })
  }

})







// -------------Help------------


// app.post("/findhelp",(req,res)=>{

//   const option = req.body.option;
//   const choix = req.body.choix;

//   if(option=="Clients")
//   {
//     db.query("SELECT id ,  nom as 'name' FROM tblexpediteurs WHERE  id = ?;",[choix],
//     (err,result)=>{
//       if(err){
//         console.log(err)
//       }
//       else{
//         res.send(result);
//       }
//     })
//   }
//   else if(option="Livreurs")
//   {
//     db.query("SELECT staffid ,  CONCAT(firstname, ' ', lastname) as 'name' FROM tblstaff WHERE role =1 and  staffid = ?;",[choix],
//     (err,result)=>{
//       if(err){
//         console.log(err)
//       }
//       else{
//         res.send(result);
//       }
//     })
//   }

//   else{

//     db.query("SELECT id ,  name as 'name' FROM tblvilles WHERE   id = ?;",[choix],
//     (err,result)=>{
//       if(err){
//         console.log(err)
//       }
//       else{
//         res.send(result);
//       }
//     })

//   }

 

// })


// ------------Partie Clients --------------


// app.post("/Clientval",(req , res)=>{
    
//   const date = req.body.date;
//   const datefrom = req.body.datefrom;
//   const dateto = req.body.dateto;
//   const id = req.body.id;


// if(datefrom=="" || dateto=="")
// {

// db.query("Select  COUNT(*) as 'NBcolis', SUM(crbt) as 'CRBT' , SUM(frais) as 'FRAIS'  , SUM(CASE WHEN status_id=2 then frais ELSE NULL END)  as 'Livre' , SUM(CASE WHEN status_id=13 then frais ELSE NULL END)  as 'Retourner a lagence' , SUM(CASE WHEN status_id=9 then frais ELSE NULL END)  as 'refuser' FROM tblcolis WHERE DATEDIFF(NOW(),date_ramassage) <= ? AND id_expediteur =?;",[date ,id ],(err,result)=>{
//     if(err)
//     {
//         console.log(err);

//     }
//     else
//     {
//         res.send(result);
//     }
// })

// }
// else{


// db.query("Select  COUNT(*) as 'NBcolis', SUM(crbt) as 'CRBT' , SUM(frais) as 'FRAIS'  , SUM(CASE WHEN status_id=2 then frais ELSE NULL END)  as 'Livre' , SUM(CASE WHEN status_id=13 then frais ELSE NULL END)  as 'Retourner a lagence' , SUM(CASE WHEN status_id=9 then frais ELSE NULL END)  as 'refuser' FROM tblcolis WHERE  id_expediteur =? AND date_ramassage BETWEEN  ? and ? ",[id , datefrom , dateto],(err,result)=>{
//   if(err)
//   {
//       console.log(err);

//   }
//   else
//   {
//       res.send(result);
//   }

// })
// }



// })





