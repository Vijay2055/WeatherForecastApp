const search_button=document.querySelector("#searchLocation")
const search_input=document.querySelector(".searchPlace")
const date_text=document.getElementsByClassName('upperText')
const address=document.querySelector(".address")
const coordText=document.querySelector(".heroTemp")
const api_key=`ecff629a58eb38820c478b1d77d91704`
const list=document.querySelectorAll('.list-two')

const imageTemp=document.querySelectorAll(".rec-image")

const textMain=document.getElementsByClassName("rec-text")




//coordinates by city name
http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

//main api
//api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}




search_button.addEventListener('click',()=>{
    const place=search_input.value
    const listElement=[]
    let lat;
    let log;
    let state;
    let cnt=5

   fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&appid=${api_key}`)
   .then((response)=>{
     return response.json()
   }).then((data)=>{
    lat=data[0].lat
    log=data[0].lon
    state=data[0].state?data[0].state:data[0].country
    
    address.innerHTML=`${place[0].toUpperCase() + place.slice(1)},${state}`
    

        fetch(`http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${log}&cnt=${cnt}&appid=${api_key}
        `).then((response)=>{   
            return response.json()
        }).then((data)=>{



           //function for converting latitude and longitude
           const getCoord=(data,sign)=>{
            let degree=Math.floor(data)
            let minuteDecimal=((data-degree)*60)
            let minute=Math.floor(minuteDecimal)
            let second=Math.floor((minuteDecimal-minute)*60)
            
            if(sign===1){
                return (`${degree}° ${minute}' ${second}"N`)
            }else if(sign===0){
                return (`${degree}° ${minute}' ${second}"E`)
            }
            
           }

           coordText.innerHTML=`${getCoord(data.city.coord.lat,1)} & ${getCoord(data.city.coord.lon,0)}`
          
            // fucntion to convert kelvin into celcius and fahreinhight
            const get_temp=(data)=>{
                let max_celcius=(parseInt(data-273.5))
                let max_fahren=parseInt(max_celcius*(9/5)+32)
                return `${max_celcius}C/${max_fahren}F`
            }
    
            //function to convert timeStamp to hours and minute
            const getTime=(data)=>{
                const date=new Date(data*1000)
                let hours=date.getHours()
                let minutes=date.getMinutes()
    
                if(hours>12){
                    hours=hours-12
                    return `${parseInt(hours/10)}${hours%10}:${parseInt(minutes/10)}${minutes%10}PM`
                }else{
                    return `${parseInt(hours/10)}${hours%10}:${parseInt(minutes/10)}${minutes%10}AM`
                }
                
               
            }


            //function to convert timestamp into date formate like 01 Dec 2023
            const get_Adate=(data)=>{
                
                const date=new Date(data*1000)
                
                let day=date.getDate()
               
                let month=date.toLocaleString('en-us', { month: 'short' })
                
                let year=date.getFullYear()
               
               return (`${parseInt(day/10)}${day%10} ${month} ${year}`)
            }


           
           
            for(let i=0; i<date_text.length; i++){
               
                date_text[i].innerHTML=get_Adate(data.list[i].dt)
                
            }
            

           
         
        //storing weather type
            const typeOfWeather=[]
            for(let i=0; i<textMain.length;i++){
                typeOfWeather[i]=data.list[i].weather[0].main
                textMain[i].innerHTML=data.list[i].weather[0].main
            }
            

            let max_Temp=[]
            let min_Temp=[]
            let list_humidity=[]
            let list_sunrize=[]
            let list_sunset=[]
            for(let i=0;i<5;i++){
                max_Temp[i]=get_temp(data.list[i].temp.max)
                
            }

            for(let i=0;i<5;i++){
                min_Temp[i]=get_temp(data.list[i].temp.min)  
            }


            for(let i=0;i<5;i++){
                list_humidity[i]=`${data.list[i].humidity}%`
                
            }

           

            for(let i=0;i<5;i++){
               list_sunrize[i]=getTime(data.list[i].sunrise)    
            }

            for(let i=0;i<5;i++){
                list_sunset[i]=getTime(data.list[i].sunset)    
             }

             

            
            

            

            
            let i=0
            list.forEach(element => {
                let liElement=element.querySelectorAll('li')
                liElement[0].innerHTML=max_Temp[i]
                liElement[1].innerHTML=min_Temp[i]
                liElement[2].innerHTML=list_humidity[i]
                liElement[3].innerHTML=list_sunrize[i]
                liElement[4].innerHTML=list_sunset[i]
                i++

                
              
            });




            let j=0
            imageTemp.forEach(element => {
                const img=element.querySelector('img')
                switch(typeOfWeather[j]){
                    case "Snow":
                        img.src="snowy.svg"
                        break;
                    case "Clouds":
                        img.src="windy_icon.svg"
                        break;
                    case "Clear":
                        img.src="synny_icon.svg"
                        break;
                    case "Rain":
                        img.src="rainy.svg"
                        break;
                }
                j++
                
                
                
                
            });
        
          
            
       
    
             
               
            
        }).catch((error)=>{
            console.log("Error:",error)
        }).catch((error)=>{
            console.log("Error in fetching coordinate api",error)
        })
    

   })

   
   
   

    

    
  
})