//B"H
console.log("Hi")

document.addEventListener('DOMContentLoaded', async function() {
    const categories = ["Home",'Mens', 
                        'Womens', 'Perfumes', 'Accessories',
        "Linens"                   
    ];

    var catMap = {
        Mens: "men",
        "Womens":"women",
        "Perfumes":"perfume",
        "Linens":"linen",
      //  "Accessories":"accessory"
    }

    var base = "/database/$categorySingular_indexes.js"
    var indexes = Object.fromEntries(
        categories.map(c => [
           
               c,
           catMap[c] ? base.replace(
                   "$categorySingular", 
                    catMap[c]
                ) : null
               
           
        ]).filter(w=>w[1])
    );
    console.log(indexes)

    var baseIMGs = "https://firebasestorage.googleapis.com/v0/b/seems-quality-clothing.appspot.com/o/categories%2F";

    var loadedData = {
        
    }
    window.indexes = indexes;
    

    var divs = {};
    
    const categoriesContainer = document.getElementById('categoriesContainer');
    const categoryNav = document.getElementById('categoryNav');

    async function switchCategory(selectedCategory) {
        if(selectedCategory == "Home") {
            console.log("HOME!",home)
            categoriesContainer.style.display = "none";
            home.style.display = "";
            return;
        }

        categoriesContainer.style.display = "";
          //  home.style.display = "none";
            
        document.querySelectorAll('.category').forEach(cat=>{
            cat.style.display = cat.id 
                === selectedCategory ? 'grid' : 'none';
        }
        );

        var curCat = selectedCategory
        console.log("Loaded",curCat,indexes,selectedCategory,categories)
        var ind = indexes[curCat];
        if(ind) {
            var d = divs[curCat];
            if(!d) return;
            d.classList.add("grid-container");
            d.innerHTML = "Loading, just wait!"
            var r = await fetch(ind);
            var t = await r.text();
            
            d.innerHTML = "Loaded!"
            if(t) {
                console.log("Trying",t)
                var imp = await import(URL.createObjectURL(new Blob([
                    t
                ], {
                    type: "application/javascript"
                })));
                if(imp && imp.default) {
                    if(!loadedData[curCat]) {
                        loadedData[curCat] = 
                            {}

                    
                    }
                    loadedData[curCat].index = imp.default;
                    //sort it;
                    loadedData[curCat].index = sort(
                        loadedData[curCat].index
                    )
                    console.log(window.s=loadedData);
                    d.innerHTML = "Loading more, just wait!";
                    var cind = loadedData[curCat].index;
                    d.innerHTML = ""
                    for(var i = 0; i < cind.length; i++) {
                        var im = document.createElement("div");
                        var pt = null; 
                        
                        try {
                            pt = baseIMGs + 
                            curCat.toLowerCase()
                            +encodeURIComponent(
                                "/"+cind[i][0]
                            )+"?alt=media";
                            t = await fetch(pt);
                            
                        } catch(e) {}
                        if(!pt) {
                            im.innerHTML = "Couldn't load this one";
                            d.appendChild(im); return;
                        }
                        im.className = "grid-item"
                        await new Promise((r,j) => {
                             var img = document.createElement("img");
                            img.src = pt;
                            im.appendChild(img);d.appendChild(im);
                            img.onload = () => {
                                r()
                            }
                            img.onerror = () =>r()
                        })
                       

                        
                    }
                }
                
            }
        }
    }

    categories.forEach(async category=>{
        // Create nav item
        const navItem = document.createElement('a');
        navItem.textContent = category;
        navItem.onclick = async ()=>await switchCategory(category);
        categoryNav.appendChild(navItem);

        // Create category content
        const categoryDiv = document.createElement('div');
        categoryDiv.id = category;
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h2>${category}</h2><p>${category}: Coming soon</p>`;
        categoriesContainer.appendChild(categoryDiv);
        divs[category] = categoryDiv;
    }
    );

    // Initially display the first category
    await switchCategory(categories[0]);
});

function sort(array) {
    return sortImagesByDate(array)
}

function sortImagesByDate(imagesArray) {
    return imagesArray.sort((a, b) => {
        // Convert date strings to Date objects
        const dateA = new Date(a[3]);
        const dateB = new Date(b[3]);

        // Compare the dates
        return dateB - dateA;
    });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // Registration failed
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

