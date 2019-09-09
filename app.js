//Storage Controller 
const StorageCtrl = ( () => {
    
    //Public functions
    return {    
        storeItem: item => {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
               items.push(item);

               //Set local Storage
               localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                //Push the new item
                items.push(item);

                //Reset local Storage
               localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: () => {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: updatedItem => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach( (item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: id => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach( (item, index) => {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items)); 
        },
        clearItemsFromStorage: () => {
            localStorage.removeItem('items');
        }
    }
})();

//Item Controller 
const ItemCtrl = (() => {
   //Item Contructor 
   const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
   }

   //Data Structure / State 
   const data = {
       items: StorageCtrl.getItemsFromStorage(),
       currentItem: null,
        totalCalories : 0
   }

   return {
       getItems: function() {
            return data.items;
       },
       addItem: (name, calories) => {
            let ID;
            //Create id
            if(data.items.length > 0) {
                ID = data.items[data.items.length-1].id + 1;
            } else {
                ID = 0;
            }
            //Convert calories string to number
            calories = parseInt(calories);

            const newItem = new Item(ID, name, calories);

            //Adding item to array
            data.items.push(newItem);

            return newItem;
       },
       logData: function() {
           return data;
       },
       getTotalCalories: () => {
           let totalCalories = 0;

           //Loop through items to get calories 
            data.items.forEach( item => {
                totalCalories += item.calories;
            });         

            data.totalCalories = totalCalories;

            return data.totalCalories;
       },
       getItemById: id => {
           let found = null;
           //Loop through the items
           data.items.forEach( item => {
                if(item.id === id) {
                    found = item;
                }
           });

           return found;
       },
       updateItem: (name, calories) => {
            //Calories string to number    
            calories = parseInt(calories);

            let found = null;
            data.items.forEach( item => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
       },
       deleteItem: id => {
            // Get ids
            const ids = data.items.map( item => {
                return item.id;
            });

            //Get index 
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index, 1);
       },
       clearAllItems: () => {
            data.items = [];
       },
       setCurrentItem: item => {
            data.currentItem = item;
       },
       getCurrentItem: () => {
            return data.currentItem;
       }
   }
})();






// UI Controller 
const UICtrl = (() => {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

   return {
        populateItemList: items => {
            let html = '';

            items.forEach( item => {
                html += `
                    <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `;
            });

            //Insert list items 
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
        getSelectors: () => {
            return UISelectors;
        },
        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: newItem => {
            //Show the list 
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //Create list item 
            let html = `
                <li class="collection-item" id="item-${newItem.id}">
                <strong>${newItem.name}: </strong> <em>${newItem.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
            `;

            //Insert list items 
            document.querySelector(UISelectors.itemList).innerHTML += html;
        },
        updateListItem: item => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            //Convert node lists to array
            listItems = Array.from(listItems);

            listItems.forEach( listItem => {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            });
        },
        deleteListItem: id => {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        removeItems: () => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            //Turn node lists into array
            listItems = Array.from(listItems);

            listItems.forEach( listItem => {
                listItem.remove();
            });
        },
        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: (totalCalories) => {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = 
            ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = 
            ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        }
   }
})();





// App Controller 
const AppCtrl = ((ItemCtrl, StorageCtrl, UICtrl) => {

     //Get UI Selectors 
     const UISelectors = UICtrl.getSelectors();


    //Load Event Listeners 
    const loadEventListeners = () => {

        //Add item event 
        document.querySelector(UISelectors.addBtn)
            .addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', e => {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    //Add item submit 
    const itemAddSubmit = e => {
        e.preventDefault();

        //Get form input from UI Controller
        const input = UICtrl.getItemInput();

        if(input.name && input.calories) {
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI list 
            UICtrl.addListItem(newItem);

            //Get total calories 
            const totalCalories = ItemCtrl.getTotalCalories();

            //Change total calories on the UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in local storage
            StorageCtrl.storeItem(newItem);

            // Clear input
            UICtrl.clearInput();
        }
    };

    //Click edit item
    const itemEditClick = e => {
        e.preventDefault();

        if(e.target.classList.contains('edit-item')){
            //Get list item id
            const listId = e.target.parentNode.parentNode.id;

            //Break into an array 
            const listIdArr = listId.split('-');

            //Get the id 
            const id = parseInt(listIdArr[1]);

            //Get item 
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }
    };

    //Update item submit function
    const itemUpdateSubmit = e => {
        e.preventDefault();

        // Get item input 
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        
        //Update UI
        UICtrl.updateListItem(updatedItem);

        //Get total calories 
        const totalCalories = ItemCtrl.getTotalCalories();

        //Change total calories on the UI
        UICtrl.showTotalCalories(totalCalories);

        //Update local storage
        StorageCtrl.updateItemStorage(updatedItem);
        
        //Clear edit state
        UICtrl.clearEditState();
    };

    //Delete button event 
    const itemDeleteSubmit = e => {
        e.preventDefault();

        //Get current item 
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from the UI
        UICtrl.deleteListItem(currentItem.id);

        //Fetch items from data structure
        const items = ItemCtrl.getItems();

        if(items.length === 0) {
            UICtrl.hideList();
        }else {
            //Populate list with items 
            UICtrl.populateItemList(items);
        }

        //Get total calories 
        const totalCalories = ItemCtrl.getTotalCalories();

        //Change total calories on the UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage 
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        
        //Clear edit state
        UICtrl.clearEditState();
    };

    //Clear items event 
    const clearAllItemsClick = e => {
        e.preventDefault();

        //Delete all items from data structure
        ItemCtrl.clearAllItems();

        //Get total calories 
        const totalCalories = ItemCtrl.getTotalCalories();

        //Change total calories on the UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeItems();

        //Clear from local storage
        StorageCtrl.clearItemsFromStorage();

        //Hide list
        UICtrl.hideList();
    };

    //Public Functions
    return {
        init: () => {
            //Clear edit state
            UICtrl.clearEditState();

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            if(items.length === 0) {
                UICtrl.hideList();
            }else {
                //Populate list with items 
                UICtrl.populateItemList(items);
            }

            //Get total calories 
            const totalCalories = ItemCtrl.getTotalCalories();

            //Change total calories on the UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listenrs
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();