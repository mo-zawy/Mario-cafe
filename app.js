const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector('#add-cafe-form');

// create element and render
function renderCafe(doc){
    let li = document.createElement("div");
    let name = document.createElement("span");
    name.className = "card-header"
    let city = document.createElement("span");
    city.className ="card-body"
    name.setAttribute('data-id',doc.id);
    li.className = "card mb-3";
    name.textContent =   doc.data().name;
    city.textContent = doc.data().city;
    btn = document.createElement('button');
    btn.className = "btn btn-danger float-right";
    btn.textContent = "delete"
    name.appendChild(btn)
    li.appendChild(name);
    li.appendChild(city);
    cafeList.appendChild(li);

    // delete data
    btn.addEventListener('click',(e)=>{
        let id = e.target.parentElement.getAttribute('data-id')
        db.collection('cafes').doc(id).delete();
        
    })
}

// getting data

/*
    db.collection('cafes')
    .get()
    .then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
            renderCafe(doc)
        })
    })
*/


// saving data

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('cafes').add({
        name:form.name.value,
        city:form.city.value
    });
    form.name.value = "";
    form.city.value ="";
})

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot=>{
    let changes = snapshot.docChanges();
    changes.forEach(change=>{
        if(change.type === 'added')
            renderCafe(change.doc)
        else if(change.type == 'removed'){
            let li = cafeList.querySelector('[data-id='+change.doc.id+']').parentElement;
            cafeList.removeChild(li);
        }
    })
})