//BUDGET CONTROL MODULE FOR CALCULATION

var budgetController = (function(){
	
	 var IncomeControl = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
		
	};
	
	var ExpansesControl = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
		
	};
	
	ExpansesControl.prototype.calPercentage = function(totalInc){
		if(totalInc > 0){
				
			this.percentage = Math.round((this.value/totalInc)*100);	
		
			
		}
		
		
		
		
		
		
	};
	
	ExpansesControl.prototype.getPercentage = function(){
	   return this.percentage;	
	};
	
	
	var calculateTotal = function(type){
		sum = 0;
		data.allItems[type].forEach(function(ele){
			sum += ele.value;
		});
		data.totals[type] = sum;
	};
	
	
	
	var data ={
		allItems:{
			inc:[],
			exp:[]
		},
		totals:{
			inc:0,
			exp:0
		},
		budget : 0,
		percentage : 0 
		
	};
	
	
	return{
		
		addItem: function(type,des,val){
			var addItm;
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length -1].id +1;
			}else{
				ID = 0;
			}
			
			
			if(type === 'exp'){
				addItem = new ExpansesControl(ID, des, val);
				
			}else if(type === 'inc'){
			    addItem = new IncomeControl(ID, des , val);
				
			}
			
			data.allItems[type].push(addItem);
			return addItem;
		},
		
		deleteItem : function(type,id){
		var ids, index;
			
			ids = data.allItems[type].map(function(current){
				return current.id;
			})
			
			index = ids.indexOf(id);
			
			if(index !== -1){
				
				data.allItems[type].splice(index,1);
			}
			
		},
		
		
		calculateBudget:function(){
		
			calculateTotal('exp');
			calculateTotal('inc');
		 		
			data.budget = data.totals.inc - data.totals.exp;
			
			if(data.percentage >= 0){
				
	          data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
				
			}else{
				data.percentage = -1;
			}
			
			
		},
		
		calculatePercentage : function(){
		data.allItems.exp.forEach(function(cur){
			cur.calPercentage(data.totals.inc);
		});
			
		},
		
		getPercentage : function(){
			
			var allPer = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPer;
		},
		
		getBudget : function(){
			
			return{
				
				budget:data.budget,
				income : data.totals.inc,
				expens : data.totals.exp,
				percent : data.percentage
				
			}
		},
		
		dataItem : function(){
			console.log(data);
		}
		
	};
	
})();




//UI CONTROL MODULE FOR CONTROLLING DISPLAY AND VIEW
var UIController = (function(){
	
	var DOMItem = {
		valueType : '.add__type',
		valueDescription : '.add__description',
		valueValue : '.add__value',
		AddBtn : '.add__btn',
		incomeContainer : '.income__list',
		expensesContainer : '.expenses__list',
		budgetLabel : '.budget__value',
		incomeLabel : '.budget__income--value',
		expensesLabel : '.budget__expenses--value',
		percentageLabel : '.budget__expenses--percentage',
		container : '.container',
		itemPecLabel :'.item__percentage',
		timeLabel : '.budget__title--month'
		
	};
	
	var formatNumber = function(num,type){
	var numSplit,int,dec,type;
		
		num = Math.abs(num);
		num = num.toFixed(2);
		numSplit = num.split('.');
		 
		int = numSplit[0];
		if(int.length > 3){
			
			int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
		}
			
		dec = numSplit[1];
		
		return (type === 'exp'? '-' : '+' ) + ' ' + int +'.' + dec;
			
		
	};
		
	
	 var nodeListForEach =  function(items,callback){
			for(var i = 0 ; i< items.length; i++){
				callback(items[i],i);
			}
				
			};
	
	
	return {
		
		getUserInputs : function(){
	  return{
	   Type : document.querySelector(DOMItem.valueType).value,
	   Description : document.querySelector(DOMItem.valueDescription).value,
	   Value :parseFloat(document.querySelector(DOMItem.valueValue).value)
	   
	   };
	  },
		
		displayDate: function(){
		var ele,months,date,month,year;
			
		months=['January','February','March','April','May','June','July','August','September','October','November','December'];
			ele = document.querySelector(DOMItem.timeLabel);
			date = new Date();
			month = date.getMonth();
			year = date.getFullYear();
			ele.textContent = months[month]+' '+year;
			
			
		},
		
		
	addNewElement : function(obj,type){
		var html,newHtml,element;

		if(type == 'inc'){

			element = DOMItem.incomeContainer;
			html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">del</button></div></div></div>';

		}else if(type == 'exp'){

			element = DOMItem.expensesContainer;
			html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">del</button></div></div></div>';

		}

			
		
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));
			
           document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
			
			
		},
		
		//Function to Set input texts  to Empty Strings
		clearFields : function(){
			var fields,fieldArr;
			fields = document.querySelectorAll(DOMItem.valueDescription +","+DOMItem.valueValue);
			fieldArr = Array.prototype.slice.call(fields);
			fieldArr.forEach(function(current){
				current.value ='';
			});
		
			fieldArr[0].focus;
		},
		
		// Function to Display total Budgets on The Main display
		displayBudget : function(obj){
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';
			
			document.querySelector(DOMItem.budgetLabel).textContent = formatNumber(obj.budget,type);
			document.querySelector(DOMItem.incomeLabel).textContent = formatNumber(obj.income,'inc');
			document.querySelector(DOMItem.expensesLabel).textContent = formatNumber(obj.expens,'exp');
			
			if(obj.percent > 0){
				document.querySelector(DOMItem.percentageLabel).textContent = obj.percent +'%';
			
			}else if(obj.percent >100){
			   document.querySelector(DOMItem.percentageLabel).textContent ='--';

			}else{
			   document.querySelector(DOMItem.percentageLabel).textContent ='--';

			}
			
		},
		
		
		//Change VIEW of Fields
		changedDisplay : function(){
			var items
			items = document.querySelectorAll(DOMItem.valueType +','+DOMItem.valueDescription+','+DOMItem.valueValue);
			
			nodeListForEach(items,function(cur){
				cur.classList.toggle('red-focus');
			});
			
			document.querySelector(DOMItem.AddBtn).classList.toggle('red');
			
		},
		
		//Display pecrcentage of individual Element
		displayPercentage : function(percentages){
			
			var fileds = document.querySelectorAll(DOMItem.itemPecLabel);
			

			
			nodeListForEach(fileds,function(current, index){
				
				if(percentages[index]){
					current.textContent = percentages[index]+"%";
				}else
					current.textContent = '--';
			});
			
		},
		
		//Delete Item From Dom
		
		deleteElement : function(selectId){
			var el = document.getElementById(selectId);
			el.parentNode.removeChild(el);
			
		},
	
	   
		
		getDOMStrings : function(){
		
		return DOMItem;
		
		}
	 
		
	};
	
})();



//APP CONTROL MODULE FOR INTERFACING BOTH MODULES
var controller = (function(budgetCtrl,uiCtrl){
	
	var setEventListener = function(){   
		
	var DOM = uiCtrl.getDOMStrings();	
	document.querySelector(DOM.AddBtn).addEventListener('click',ctrlAddItem);
	document.addEventListener('keypress',function(event){
		
		if(event.keyCode === 13 || event.which === 13){
		ctrlAddItem();
		}
	});
		
		document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
		document.querySelector(DOM.valueType).addEventListener('change',uiCtrl.changedDisplay);
		
	};
	
	var updateBudget = function(){
		//Calculate Budget
		budgetCtrl.calculateBudget();
		
		// Fetch Budget Values
		var totalValues = budgetCtrl.getBudget();
		
		uiCtrl.displayBudget(totalValues);

	};
	
	var updatePercentage = function(){
		
		//Calculate Percentage 
		budgetCtrl.calculatePercentage();
		
		
		//Fetch Percentage 
		var percent = budgetCtrl.getPercentage();
		
		
		//Display Percentage
		uiCtrl.displayPercentage(percent);
		
	};
	
	
	//Functionality to the controller 
	var  ctrlAddItem = function(){
		var inputValues,newItem;
		
		//Get Inputs from the UI	
		inputValues = uiCtrl.getUserInputs();
		
		if(inputValues.Description !== '' && !isNaN(inputValues.Value)&& inputValues.Value > 0){
			
		//Add Element in The DataStructure
        newItem = budgetCtrl.addItem(inputValues.Type,inputValues.Description,inputValues.Value);
	
		//Add Element in UI
	    uiCtrl.addNewElement(newItem,inputValues.Type);
		
		//Clear Fileds in UI
		uiCtrl.clearFields();
			
		//Update the Final UI Budget
		updateBudget();
			
			
		//Update Percentage
		updatePercentage();
			
		}
		
		
		
	};
	
	var ctrlDeleteItem = function(event){
		var item,itemId;
		item = event.target.parentNode.parentNode.parentNode.id;
		
		if(item){
			itemId = item.split('-');
			
			idType =  itemId[0];
			id = parseInt(itemId[1]);
			
		}
		
		//delete item from data structure
		budgetCtrl.deleteItem(idType,id);
		
		//delete item from Ui
		uiCtrl.deleteElement(item);
		
		//update budget
		updateBudget();
		
		//Update Percentage
		updatePercentage();
		
	};
	
	
	return{
		
		init : function(){
		console.log("Application Begins");
		uiCtrl.displayDate();
		uiCtrl.displayBudget({budget:0,income:0,expens:0,percent:-1});
		setEventListener();
	   }
		
	} 
	
	
})(budgetController,UIController);


            controller.init();



