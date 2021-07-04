
var items = new Map()
var crew = new Map()
var calcCrew
var calcHeist
var heist = {
    name :"",
    hasPayOut: false,
    count: 0,
    sum: 0,
    "Big Bag": 0,
    "Small Bag": 0,
    "Cash": 0,
    "Gold": 0,
    "Watch": 0,
    server:""

}


function setValues(public){

    if(public){

        //public Server
        items.set("Gold", 10000)
        items.set("Big Bag", 50000)
        items.set("Small Bag", 250)
        items.set("Watch", 100)
        items.set("Cash", 1)
        items.set("Green Laptop", 10000)
        items.set("Blue Laptop", 25000)
        items.set("Red Laptop", 25000)
        items.set("Golden Laptop", 150000)
        items.set("Vault USB Key", 25000)
        items.set("Pixelpad", 50000)
        items.set("Thermite", 7000)

    } else {

        //Whitelist Server
        items.set("Gold", 5000)
        items.set("Big Bag", 50000)
        items.set("Small Bag", 250)
        items.set("Watch", 50)
        items.set("Cash", 1)
        items.set("Green Laptop", 10000)
        items.set("Blue Laptop", 25000)
        items.set("Red Laptop", 25000)
        items.set("Golden Laptop", 150000)
        items.set("Vault USB Key", 25000)
        items.set("Pixelpad", 50000)
        items.set("Thermite", 7000)

    }
}

function setHeistName(){

    heist.name = document.getElementById("input-heistName").value
    document.getElementById("ctl-addMemeber").classList.remove("hidden");
    document.getElementById("ctl-createHeist").classList.add("hidden")
    var publicServer = document.getElementById("input-publicServer").checked

    if(publicServer){
        document.getElementById("heistName").innerHTML = document.getElementById("input-heistName").value + " - Public Server"
        
        setValues(publicServer)
        heist.server = "Public Server"
    } else {
        document.getElementById("heistName").innerHTML = document.getElementById("input-heistName").value + " - Whitelist Server"
 
        setValues(publicServer)
        heist.server = "Whitelist Server"
    }

    

}

function addCrewMember(){

    //getting values from HTML
    var name = document.getElementById("input-AddCrewMember-name").value
    var pos = document.getElementById("input-AddCrewMember-position").value

    //Checks input
    if(name === undefined || !name){
        //Name is not allowed oto be null
        alert("Please set a name")
        return;
    }
    if(crew.get(name) !== undefined && crew.size >0 ){
        //checks if the name is already in there
        alert("There must be a different name")
        return;
    }
    if(crew.size >= 4){
        //sets maxium size of member
        alert("There can´t be more than 4 Crew Member")
        return;

    }

    //Create HTML INPUT
    var newCard = document.createElement("div")
    newCard.className = "card crew-member"
    newCard.style = "width: 18rem"
    newCard.id = "crewMember-" + name

    var cardBody = document.createElement("div")
    cardBody.className = "card-body"

    var cardTitle = document.createElement("h4")
    cardTitle.className = "card-title"
    cardTitle.innerHTML = "Player"

    var cardSubtitle = document.createElement("h6")
    cardSubtitle.className = "card-subtitle mb-2 text-muted"
    cardSubtitle.innerHTML = name

    var cardNote = document.createElement("p")
    cardNote.innerHTML= pos

    var cardRMButton = document.createElement("button")
    cardRMButton.type = "button"
    cardRMButton.className = "btn btn-warning btn-sm"
    cardRMButton.innerHTML = "remove"
    cardRMButton.setAttribute("onclick", "removeCrewMember('"+name+"');");
    

    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardSubtitle)
    cardBody.appendChild(cardNote)
    cardBody.appendChild(cardRMButton)

    newCard.appendChild(cardBody)

    var crewdiv = document.getElementById("dv-crew")
    crewdiv.appendChild(newCard)

    document.getElementById("ctl-addInvest").classList.remove("hidden");
    document.getElementById("ctl-addPayOut").classList.remove("hidden");
    

    //add to selection
    var investPlayerSelection = document.getElementById("input-Invest-crewMember")
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.id = "investOption-"+name;
    investPlayerSelection.appendChild(opt);

    crew.set(name, {
        investSum :  0,
        investItems: [],
        "Big Bag": 0,
        "Small Bag": 0,
        "Cash": 0,
        "Gold": 0,
        "Watch": 0,
        sum: 0

    });

    if(crew.size == 4){
        document.getElementById("ctl-addMemeber").classList.add("hidden")

    }

}

function removeCrewMember(name){

    //remove HTML Stuff
    var elem = document.getElementById("crewMember-" + name);
    elem.parentNode.removeChild(elem);

    //remove Slection option
    var investPlayerSelection = document.getElementById("investOption-"+ name)
    investPlayerSelection.remove();

    //remove from object
    removeInvest(name);
    crew.delete(name);
    
    if(crew.size == 0){

        document.getElementById("ctl-addInvest").classList.add("hidden");
        document.getElementById("ctl-addPayOut").classList.add("hidden");
    }

    document.getElementById("ctl-addMemeber").classList.remove("hidden")

}

function addInvest(){

    var name = document.getElementById("input-Invest-crewMember").options[document.getElementById("input-Invest-crewMember").selectedIndex].text;
    var item = document.getElementById("input-Invest-item").options[document.getElementById("input-Invest-item").selectedIndex].text;
    var value = document.getElementById("input-Invest-value").value

    var obj = crew.get(name);

    if(obj.investItems.length == 0){
        obj.investItems[0] = item
        obj.investSum =  parseInt(value)

        var newCard = document.createElement("div")
        newCard.className = "card crew-invest"
        newCard.style = "width: 18rem"
        newCard.id = "crewInvest-" + name

        var cardBody = document.createElement("div")
        cardBody.className = "card-body"
        
        var cardTitle = document.createElement("h4")
        cardTitle.className = "card-title"
        cardTitle.innerHTML = "Invest-" + name

        var cardSubList = document.createElement("div")
        cardSubList.id = "investList-" + name

        var cardSubtitle = document.createElement("h6")
        cardSubtitle.className = "card-subtitle mb-2 text-muted"
        cardSubtitle.innerHTML = item +" - " + value + "$"

        cardSubList.appendChild(cardSubtitle)

        var cardNote = document.createElement("p")
        cardNote.id = "investSum-" + name 
        cardNote.innerHTML= obj.investSum + "$"

        var cardRMButton = document.createElement("button")
        cardRMButton.type = "button"
        cardRMButton.className = "btn btn-warning btn-sm"
        cardRMButton.innerHTML = "remove"
        cardRMButton.setAttribute("onclick", "removeInvest('"+name+"');");

        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardSubList)
        cardBody.appendChild(cardNote)
        cardBody.appendChild(cardRMButton)

        newCard.appendChild(cardBody)

        var crewdiv = document.getElementById("dv-invest")
        crewdiv.appendChild(newCard)

    } else {

        obj.investItems[obj.investItems.length] = item
        obj.investSum = parseInt(obj.investSum) + parseInt(value)

        //create item for list
        var cardSubtitle = document.createElement("h6")
        cardSubtitle.className = "card-subtitle mb-2 text-muted"
        cardSubtitle.innerHTML = item +" - " + value + "$"

        //adding item to list
        var investList = document.getElementById("investList-" + name)
        investList.appendChild(cardSubtitle)

        //changing current sum 
        var investSumP = document.getElementById("investSum-" + name)
        investSumP.innerHTML = obj.investSum + "$"

    }

    crew.set(name, obj);
    
}

function removeInvest(name){

    //removing html stuff
    var elem = document.getElementById("crewInvest-" + name);
    if(elem){
        elem.parentNode.removeChild(elem);
    }
    

    //removing from obj
    crew.set(name, {
        investSum :  0,
        investItems: [],
        "Big Bag": 0,
        "Small Bag": 0,
        "Cash": 0,
        "Gold": 0,
        "Watch": 0,
        sum: 0

    })

}

function addPayOut(){

    var item = document.getElementById("input-PayOut-item").options[document.getElementById("input-PayOut-item").selectedIndex].text;
    var count = document.getElementById("input-PayOut-count").value

    if(!items.has(item)){

        alert("Item not found")
        return;
    }

    if(!heist.hasPayOut){

        heist.hasPayOut = true

        //main
        var payOutDiv = document.createElement("div")
        payOutDiv.className = "card text-center heist-payout"

            //below main - HEAD
            var cardHead = document.createElement("div")
            cardHead.className = "card-header"

                var cardTitle = document.createElement("h4")
                cardTitle.innerHTML = "Pay Out"
                cardTitle.className ="title-payout"

            cardHead.appendChild(cardTitle)


            //below main - BODY
            var cardBody = document.createElement("div")
            cardBody.className = "card-body"

                var table = document.createElement("table");
                table.className = "table table-sm"

                    var thead = document.createElement("thead")

                        var trow = document.createElement("tr")
                            
                            var th = document.createElement("th")
                            th.scope = "col"
                            th.innerHTML = "#"

                        trow.appendChild(th)

                            var th2 = document.createElement("th")
                            th2.scope = "col"
                            th2.innerHTML = "Item"

                        trow.appendChild(th2)

                            var th3 = document.createElement("th")
                            th3.scope = "col"
                            th3.innerHTML = "Count"
                        
                        trow.appendChild(th3)

                            var th4 = document.createElement("th")
                            th4.scope = "col"
                            th4.innerHTML = "Sum"

                        trow.appendChild(th4)

                            var th5 = document.createElement("th")
                            th5.scope = "col"
                            th5.innerHTML = "remove"

                        trow.appendChild(th5)

                    thead.appendChild(trow)

                table.appendChild(thead)

                    var tbody = document.createElement("tbody")
                    tbody.id ="payOutTableBody"
                
                table.appendChild(tbody)

            cardBody.appendChild(table)

                

            //below Main - FOOTER
            var cardFooter = document.createElement("div")
            cardFooter.className = "card-footer"
            cardFooter.id = "payOutSum"
            cardFooter.innerHTML = "sum: 0$"
            
        payOutDiv.appendChild(cardTitle)
        payOutDiv.appendChild(cardBody)
        payOutDiv.appendChild(cardFooter)

        var motherdiv = document.getElementById("dv-payout")
        motherdiv.appendChild(payOutDiv)

        document.getElementById("ctl-calcPayOut").classList.remove("hidden");

    }

    var trowNew = document.createElement("tr")
    trowNew.id = "payOutRow-"+ (heist.count + 1)
    
        var th = document.createElement("th")
        th.scope = "row"
        th.innerHTML = heist.count + 1

    trowNew.appendChild(th)

        var td = document.createElement("td")
        td.innerHTML = item
        td.id = "payOutItem-" + (heist.count + 1)

    trowNew.appendChild(td)

        var td2 = document.createElement("td")
        td2.innerHTML = count
        td2.id = "payOutCount-" + (heist.count + 1)

    trowNew.appendChild(td2)

        var td3 = document.createElement("td")
        td3.innerHTML = count * items.get(item) + "$"
        td3.id = "payOutSum-" + (heist.count + 1)

    trowNew.appendChild(td3)

        var button = document.createElement("button")
        button.type = "button"
        button.className = "btn btn-warning btn-sm"
        button.innerHTML = "remove"
        button.setAttribute("onclick", "removePayOut(" + (heist.count + 1) +");");

    trowNew.appendChild(button)


    var payOutTable = document.getElementById("payOutTableBody")
    payOutTable.appendChild(trowNew)

    heist[item] = parseInt(heist[item]) + parseInt(count);
    heist.sum = heist.sum + (count * items.get(item))
    heist.count++;

    var cardFoo = document.getElementById("payOutSum")
    cardFoo.innerHTML = "Sum: " + heist.sum + "$"
}

function removePayOut(pos){


    var item = document.getElementById("payOutItem-" + pos).innerHTML
    var count = document.getElementById("payOutCount-" + pos).innerHTML
    var sum = document.getElementById("payOutSum-" + pos).innerHTML

    console.log("values: "+item  + " " + count + " " + sum)
    var itemRow = document.getElementById("payOutRow-" + pos)
    itemRow.parentNode.removeChild(itemRow);

    heist[item] = heist[item] - count
    heist.sum = heist.sum - (count * items.get(item))

    var cardFoo = document.getElementById("payOutSum")
    cardFoo.innerHTML = "Sum: " + heist.sum + "$"

}

function calcProportion(){

    calcCrew = new Map(crew)

    calcCrew.forEach((values,keys)=>{

        calcCrew.set(keys,Object.assign({},values))
    })

    calcHeist = Object.assign({},heist)


    calcCrew.forEach((values,keys)=>{

        //Calc investet Sums
        while(values.investSum > 0 && ( calcHeist["Big Bag"] > 0 ||  calcHeist["Gold"] > 0 ||  calcHeist["Small Bag"] > 0 ||  calcHeist["Watch"] > 0 ||  calcHeist["Cash"] > 0)){

            if(values.investSum >= items.get("Big Bag") && calcHeist["Big Bag"] > 0 ){

                calcHeist["Big Bag"] = calcHeist["Big Bag"] -1
                values.investSum = values.investSum - items.get("Big Bag")
                calcHeist.sum = calcHeist.sum - items.get("Big Bag")
                values["Big Bag"] = values["Big Bag"] +1
                values.sum = values.sum + items.get("Big Bag")
                calcCrew.set(keys,values)

            } else if(values.investSum >= items.get("Gold") &&  calcHeist["Gold"] > 0 ) {

                calcHeist["Gold"] = calcHeist["Gold"] -1
                values.investSum = values.investSum - items.get("Gold") 
                calcHeist.sum = calcHeist.sum - items.get("Gold") 
                values["Gold"] = values["Gold"] +1
                values.sum = values.sum + items.get("Gold")
                calcCrew.set(keys,values)
                            
            } else if(values.investSum >= items.get("Small Bag")   &&  calcHeist["Small Bag"] > 0 ) {

                calcHeist["Small Bag"] = calcHeist["Small Bag"] -1
                values.investSum = values.investSum - items.get("Small Bag")
                calcHeist.sum = calcHeist.sum - items.get("Small Bag")
                values["Small Bag"] = values["Small Bag"] +1
                values.sum = values.sum + items.get("Small Bag")
                calcCrew.set(keys,values)

            } else if(values.investSum >= items.get("Watch")   &&  calcHeist["Watch"] > 0 ) {

                calcHeist["Watch"] = calcHeist["Watch"] -1
                values.investSum = values.investSum - items.get("Watch")
                calcHeist.sum = calcHeist.sum - items.get("Watch")
                values["Watch"] = values["Watch"] +1
                values.sum = values.sum + items.get("Watch")
                calcCrew.set(keys,values)

            } else if(values.investSum >= items.get("Cash")  &&  calcHeist["Cash"] > 0 ) {

                calcHeist["Cash"] = calcHeist["Cash"] -1
                values.investSum = values.investSum - items.get("Cash") 
                calcHeist.sum = calcHeist.sum - items.get("Cash") 
                values["Cash"] = values["Cash"] +1
                values.sum = values.sum + items.get("Cash")
                calcCrew.set(keys,values)
            } 
            
        }

    })

    //Sharing Big Bags
    while(calcHeist["Big Bag"] > 0){

        calcCrew.forEach((values,keys)=>{

            if(calcHeist["Big Bag"] == 0){

                var tempSum = 0;
                                                 
                while(calcHeist["Gold"] > 0 && tempSum < items.get("Big Bag")){

   
                    calcHeist["Gold"] = calcHeist["Gold"] - 1
                    calcHeist.sum = calcHeist.sum - items.get("Gold")

                    values["Gold"] = values["Gold"] +1
                    values.sum = values.sum + items.get("Gold")

                    tempSum = tempSum+  items.get("Gold")

                }

                while(calcHeist["Small Bag"] > 0 && tempSum < items.get("Big Bag")){

                    
                    calcHeist["Small Bag"] = calcHeist["Small Bag"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Small Bag")

                    values["Small Bag"] = values["Small Bag"] + 1
                    values.sum = values.sum + items.get("Small Bag")

                    tempSum = tempSum+ items.get("Small Bag")
                }

                while(calcHeist["Watch"] > 0 && tempSum < items.get("Big Bag")){

                    
                    calcHeist["Watch"] = calcHeist["Watch"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Watch")

                    values["Watch"] = values["Watch"] +1
                    values.sum = values.sum + items.get("Watch")

                    tempSum = tempSum + items.get("Watch")
                }

                while(calcHeist["Cash"] > 0 && tempSum < items.get("Big Bag")){

                    
                    calcHeist["Cash"] = calcHeist["Cash"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Cash")

                    values["Cash"] = values["Cash"] +1
                    values.sum = values.sum + items.get("Cash")

                    tempSum = tempSum + items.get("Cash")
                }
               
               
            } else {
                
                calcHeist["Big Bag"] = calcHeist["Big Bag"] - 1
                calcHeist.sum = calcHeist.sum - items.get("Big Bag")

                values["Big Bag"] = values["Big Bag"] +1 
                values.sum = values.sum + items.get("Big Bag")

            }

            calcCrew.set(keys,values)

        })

    }
    

    //Sharing Gold
    while(calcHeist["Gold"] > 0){

        calcCrew.forEach((values,keys)=>{

            if(calcHeist["Gold"] == 0){

                var tempSum = 0;
              

                while(calcHeist["Small Bag"] > 0 && tempSum < items.get("Gold")){

                    calcHeist["Small Bag"] = calcHeist["Small Bag"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Small Bag")

                    values["Small Bag"] = values["Small Bag"] + 1
                    values.sum = values.sum + items.get("Small Bag")

                    tempSum = tempSum+ items.get("Small Bag")
                }

                while(calcHeist["Watch"] > 0 && tempSum < items.get("Gold")){

                    
                    calcHeist["Watch"] = calcHeist["Watch"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Watch")

                    values["Watch"] = values["Watch"] +1
                    values.sum = values.sum + items.get("Watch")

                    tempSum = tempSum + items.get("Watch")
                }

                while(calcHeist["Cash"] > 0 && tempSum < items.get("Gold")){

                    calcHeist["Cash"] = calcHeist["Cash"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Cash")

                    values["Cash"] = values["Cash"] +1
                    values.sum = values.sum + items.get("Cash")

                    tempSum = tempSum + items.get("Cash")
                }
               
               
            } else {

                calcHeist["Gold"] = calcHeist["Gold"] - 1
                calcHeist.sum = calcHeist.sum - items.get("Gold")

                values["Gold"] = values["Gold"] +1 
                values.sum = values.sum + items.get("Gold")

            }

            calcCrew.set(keys,values)

        })

    }

     

    //Sharing Small Bags
    while(calcHeist["Small Bag"] > 0){

        calcCrew.forEach((values,keys)=>{

            if(calcHeist["Small Bag"] == 0){

                var tempSum = 0;
                while(calcHeist["Watch"] > 0 && tempSum < items.get("Small Bag")){

                    
                    calcHeist["Watch"] = calcHeist["Watch"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Watch")

                    values["Watch"] = values["Watch"] +1
                    values.sum = values.sum + items.get("Watch")

                    tempSum = tempSum + items.get("Watch")
                }

                while(calcHeist["Cash"] > 0 && tempSum < items.get("Small Bag")){

                    calcHeist["Cash"] = calcHeist["Cash"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Cash")

                    values["Cash"] = values["Cash"] +1
                    values.sum = values.sum + items.get("Cash")

                    tempSum = tempSum + items.get("Cash")
                }
               
               
            } else {

                calcHeist["Small Bag"] = calcHeist["Small Bag"] - 1
                calcHeist.sum = calcHeist.sum - items.get("Small Bag")

                values["Small Bag"] = values["Small Bag"] +1 
                values.sum = values.sum + items.get("Small Bag")

            }

            calcCrew.set(keys,values)

        })

        

    }

   
    //Sharing Watches
    while(calcHeist["Watch"] > 0){

        calcCrew.forEach((values,keys)=>{

            if(calcHeist["Watch"] == 0){

                var tempSum = 0;
              
                while(calcHeist["Cash"] > 0 && tempSum < items.get("Watch")){

                    calcHeist["Cash"] = calcHeist["Cash"] -1
                    calcHeist.sum = calcHeist.sum - items.get("Cash")

                    values["Cash"] = values["Cash"] +1
                    values.sum = values.sum + items.get("Cash")

                    tempSum = tempSum + items.get("Cash")
                }
               
               
            } else {

                calcHeist["Watch"] = calcHeist["Watch"] -1
                calcHeist.sum = calcHeist.sum - items.get("Watch")

                values["Watch"] = values["Watch"] +1
                values.sum = values.sum + items.get("Watch")

            }

            calcCrew.set(keys,values)

        })

        

    }

    
    //Sharing Cash
    while(calcHeist["Cash"] > 0){

        calcCrew.forEach((values,keys)=>{

            if(calcHeist["Cash"] != 0){

                calcHeist["Cash"] = calcHeist["Cash"] -1
                calcHeist.sum = calcHeist.sum - items.get("Cash")
    
                values["Cash"] = values["Cash"] + 1
                values.sum = values.sum + items.get("Cash")
                
            }

            calcCrew.set(keys,values)

        })

    }

    createMemberPayOut()
     
}

function createMemberPayOut(){

    var main = document.getElementById("dv-split")
    main.innerHTML = ""
    document.getElementById("ctl-screenShot").classList.remove("hidden");

    calcCrew.forEach((values,keys)=>{

        var newCard = document.createElement("div")
        newCard.className = "card crew-payout"
        newCard.style = "width: 18rem"
        newCard.id = "crewPayout-" + keys

        var cardBody = document.createElement("div")
        cardBody.className = "card-body"
        
        var cardTitle = document.createElement("h4")
        cardTitle.className = "card-title"
        cardTitle.innerHTML = "PayOut-" + keys

        var cardSubList = document.createElement("div")
        cardSubList.id = "payoutList-" + keys

        if(values["Big Bag"] > 0){
            var cardSubtitleBB = document.createElement("h6")
            cardSubtitleBB.className = "card-subtitle mb-2 text-muted"
            cardSubtitleBB.innerHTML = values["Big Bag"] + "x Big Bags - " + (values["Big Bag"] * items.get("Big Bag")) + "$"
            cardSubList.appendChild(cardSubtitleBB)
        }

        if(values["Gold"] > 0){
            var cardSubtitleG = document.createElement("h6")
            cardSubtitleG.className = "card-subtitle mb-2 text-muted"
            cardSubtitleG.innerHTML = values["Gold"] + "x Gold - " + (values["Gold"] * items.get("Gold")) + "$"
            cardSubList.appendChild(cardSubtitleG)
        }

        if(values["Small Bag"] > 0){
            var cardSubtitleSB = document.createElement("h6")
            cardSubtitleSB.className = "card-subtitle mb-2 text-muted"
            cardSubtitleSB.innerHTML = values["Small Bag"] + "x Small Bags - " + (values["Small Bag"] * items.get("Small Bag")) + "$"
            cardSubList.appendChild(cardSubtitleSB)
        }

        if(values["Watch"] > 0){
            var cardSubtitleW = document.createElement("h6")
            cardSubtitleW.className = "card-subtitle mb-2 text-muted"
            cardSubtitleW.innerHTML = values["Watch"] + "x Watches - " + (values["Watch"] * items.get("Watch")) + "$"
            cardSubList.appendChild(cardSubtitleW)
        }

        if(values["Cash"] > 0){
            var cardSubtitleW = document.createElement("h6")
            cardSubtitleW.className = "card-subtitle mb-2 text-muted"
            cardSubtitleW.innerHTML = values["Cash"] + "$ Cash"
            cardSubList.appendChild(cardSubtitleW)
        }

        var cardNote = document.createElement("p")
        cardNote.id = "investSum-" + keys
        cardNote.innerHTML= "Sum: " + values.sum + "$"



        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardSubList)
        cardBody.appendChild(cardNote)

        newCard.appendChild(cardBody)

        var crewdiv = document.getElementById("dv-split")
        crewdiv.appendChild(newCard)

       

    })

    window.scrollTo(0,document.body.scrollHeight);

}

function valueAutoFill(){

    var item = document.getElementById("input-Invest-item").options[document.getElementById("input-Invest-item").selectedIndex].text;
    var value = items.get(item)
    document.getElementById("input-Invest-value").value = parseInt(value);

}

function removeCount(){

    document.getElementById("input-PayOut-count").value = null

} 

function createOverview(){

    document.getElementById("overview-title").classList.remove("hidden");

    var main = document.getElementById("overview")
    main.innerHTML = ""

    var heistInvestSum = 0;
    var heistInvestedItems = []
    var crewArr = []
    var heistPayOutItems = []

    var OverviewDiv = document.getElementById("overview")

    if(heist["Big Bag"] > 0){
        heistPayOutItems.push("Big Bag")
    }
    if(heist["Gold"] > 0){
        heistPayOutItems.push("Gold")
    }
    if(heist["Small Bag"] > 0){
        heistPayOutItems.push("Small Bag")
    }
    if(heist["Watch"] > 0){
        heistPayOutItems.push("Watch")
    }
    if(heist["Cash"] > 0){
        heistPayOutItems.push("Cash")
    }

    crew.forEach((values,keys)=>{

        heistInvestSum += values.investSum;
        crewArr.push(keys)
        values.investItems.forEach((element)=>{

            if(!heistInvestedItems.includes(element)){
                heistInvestedItems.push(element)
            }
        })
        
    })

    var newCard = document.createElement("div")
    newCard.className = "card crew-member"
    newCard.style = "width: 18rem"
    newCard.id = "heist-Overview"

    var cardBody = document.createElement("div")
    cardBody.className = "card-body"

    var cardTitle = document.createElement("h4")
    cardTitle.className = "card-title"
    cardTitle.innerHTML =  heist.name 

    var cardSubtitle6 = document.createElement("h5")
    cardSubtitle6.className = "card-subtitle mb-2 fw-bold"
    cardSubtitle6.innerHTML = "Calculated by AFKspezi´s NP-PayOutCalc"
    
    var cardSubtitle0 = document.createElement("h6")
    cardSubtitle0.className = "card-subtitle mb-2 text-muted"
    cardSubtitle0.innerHTML = "Server: " + heist.server

    var cardSubtitle1 = document.createElement("h6")
    cardSubtitle1.className = "card-subtitle mb-2 text-muted"
    cardSubtitle1.innerHTML = "Invested Sum: " + heistInvestSum + "$"

    var cardSubtitle2 = document.createElement("h6")
    cardSubtitle2.className = "card-subtitle mb-2 text-muted"
    cardSubtitle2.innerHTML = "Invested Items: " + heistInvestedItems.join(", ")

    var cardSubtitle3 = document.createElement("h6")
    cardSubtitle3.className = "card-subtitle mb-2 text-muted"
    cardSubtitle3.innerHTML = "Payout: " + heist.sum +  "$"

    var cardSubtitle4 = document.createElement("h6")
    cardSubtitle4.className = "card-subtitle mb-2 text-muted"
    cardSubtitle4.innerHTML = "Payout Items: " + heistPayOutItems.join(", ")

    var cardSubtitle5 = document.createElement("h6")
    cardSubtitle5.className = "card-subtitle mb-2 text-muted"
    cardSubtitle5.innerHTML = "Crew: " + crewArr.join(", ")



    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardSubtitle6)
    cardBody.appendChild(cardSubtitle0)
    cardBody.appendChild(cardSubtitle1)
    cardBody.appendChild(cardSubtitle2)
    cardBody.appendChild(cardSubtitle3)
    cardBody.appendChild(cardSubtitle4)
    cardBody.appendChild(cardSubtitle5)

    
    newCard.appendChild(cardBody)

    OverviewDiv.appendChild(newCard)

    crew.forEach((values,keys)=>{

        var crewInvestedItems = []

        values.investItems.forEach((element)=>{

            if(!crewInvestedItems.includes(element)){
                crewInvestedItems.push(element)
            }
        })

        var newCard = document.createElement("div")
        newCard.className = "card crew-member"
        newCard.style = "width: 18rem"
        newCard.id = "heist-Overview"

        var cardBody = document.createElement("div")
        cardBody.className = "card-body"

        var cardTitle = document.createElement("h4")
        cardTitle.className = "card-title"
        cardTitle.innerHTML = keys
    
        var cardSubtitle0 = document.createElement("h6")
        cardSubtitle0.className = "card-subtitle mb-2 text-muted"
        cardSubtitle0.innerHTML = "Invested Sum: " + values.investSum  +"$"

        var cardSubtitle1 = document.createElement("h6")
        cardSubtitle1.className = "card-subtitle mb-2 text-muted"
        cardSubtitle1.innerHTML = "Invested Items: " + crewInvestedItems.join(", ")

        var cardSubtitle2 = document.createElement("h6")
        cardSubtitle2.className = "card-subtitle mb-2 text-muted"
        cardSubtitle2.innerHTML = "Payout sum: " + calcCrew.get(keys).sum +"$"

        var cardSubtitle3 = document.createElement("h5")
        cardSubtitle3.className = "card-subtitle mb-2  fw-bold"
        cardSubtitle3.innerHTML = "Payout in Items:"


        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardSubtitle0)
        cardBody.appendChild(cardSubtitle1)
        cardBody.appendChild(cardSubtitle2)
        cardBody.appendChild(cardSubtitle3)


        if(calcCrew.get(keys)["Big Bag"] > 0){
            var cardSubtitleBB = document.createElement("h6")
            cardSubtitleBB.className = "card-subtitle mb-2 text-muted"
            cardSubtitleBB.innerHTML = calcCrew.get(keys)["Big Bag"] + "x Big Bags"
            cardBody.appendChild(cardSubtitleBB)
        }

        if(calcCrew.get(keys)["Gold"] > 0){
            var cardSubtitleG = document.createElement("h6")
            cardSubtitleG.className = "card-subtitle mb-2 text-muted"
            cardSubtitleG.innerHTML = calcCrew.get(keys)["Gold"] + "x Gold"
            cardBody.appendChild(cardSubtitleG)
        }

        if(calcCrew.get(keys)["Small Bag"] > 0){
            var cardSubtitleSB = document.createElement("h6")
            cardSubtitleSB.className = "card-subtitle mb-2 text-muted"
            cardSubtitleSB.innerHTML = calcCrew.get(keys)["Small Bag"] + "x Small Bags"
            cardBody.appendChild(cardSubtitleSB)
        }

        if(calcCrew.get(keys)["Watch"] > 0){
            var cardSubtitleW = document.createElement("h6")
            cardSubtitleW.className = "card-subtitle mb-2 text-muted"
            cardSubtitleW.innerHTML = calcCrew.get(keys)["Watch"] + "x Watches"
            cardBody.appendChild(cardSubtitleW)
        }

        if(calcCrew.get(keys)["Cash"] > 0){
            var cardSubtitleW = document.createElement("h6")
            cardSubtitleW.className = "card-subtitle mb-2 text-muted"
            cardSubtitleW.innerHTML = calcCrew.get(keys)["Cash"] + "$ Cash"
            cardBody.appendChild(cardSubtitleW)
        }



        

        newCard.appendChild(cardBody)
        OverviewDiv.appendChild(newCard)

        window.scrollTo(0,document.body.scrollHeight);

    })

}