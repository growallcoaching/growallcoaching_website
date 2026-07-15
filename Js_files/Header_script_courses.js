
                                // Header Script is heear to Courses.html 
        fetch('../Header/Header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
                if (window.initializeHeaderUi) {
                    window.initializeHeaderUi();
                }
            })
            .catch(error => console.error('Failed to load header:', error));
 

// Courses_card javascript starts from here 


        fetch('./Courses_card.html')
            .then(async (res) => {

                console.log("STATUS:", res.status);
                console.log("URL:", res.url);

                const data = await res.text();

                console.log("DATA START ----------------");
                console.log(data);
                console.log("DATA END ----------------");

                const container = document.getElementById("crses-gac-products-showcase");

                container.innerHTML = data;

                console.log("Container:", container.innerHTML);

                console.log(document.getElementById("crse-gac-course-grid"));

                if (window.initializeCourses) {
                    await window.initializeCourses();
                }

            })
            .catch(console.error);