window.initializeCourses = async function () {

    // ===============================
    // Supabase Initialize
    // ===============================
    if (!window.supabaseUrl || !window.supabaseKey) {
        console.error("Supabase config missing.");
        return;
    }

    const supabaseClient = window.supabase.createClient(
        window.supabaseUrl,
        window.supabaseKey
    );

    let allCourses = [];
    let allCategories = [];
    let selectedFilter = "All";

    // ===============================
    // DOM Elements
    // ===============================
    const courseGrid = document.getElementById("crse-gac-course-grid");
    const searchInput = document.getElementById("crse-gac-search-input");
    const filterList = document.querySelector(".crse-gac-filter-list");

    if (!courseGrid || !searchInput || !filterList) {
        console.error("Course HTML not loaded yet.");
        return;
    }

    // ===============================
    // Load Categories
    // ===============================
    async function loadCategories() {

        const { data, error } = await supabaseClient
            .from("categories")
            .select("*")
            .order("name");

        if (error) {
            console.error(error);
            return;
        }

        allCategories = data;

        filterList.innerHTML = "";

        const allBtn = document.createElement("button");
        allBtn.className = "crse-gac-filter-chip active";
        allBtn.dataset.filter = "All";
        allBtn.textContent = "All";

        filterList.appendChild(allBtn);

        allCategories.forEach(cat => {

            const btn = document.createElement("button");

            btn.className = "crse-gac-filter-chip";
            btn.dataset.filter = cat.name;
            btn.textContent = cat.name;

            filterList.appendChild(btn);

        });

        document.querySelectorAll(".crse-gac-filter-chip").forEach(btn => {

            btn.addEventListener("click", () => {

                document
                    .querySelectorAll(".crse-gac-filter-chip")
                    .forEach(x => x.classList.remove("active"));

                btn.classList.add("active");

                selectedFilter = btn.dataset.filter;

                renderCourses();

            });

        });

    }

    // ===============================
    // Load Courses
    // ===============================
    async function loadCourses() {

        const { data, error } = await supabaseClient
            .from("courses_with_stats")
            .select(`
                id,
                name,
                description,
                logo_url,
                tint,
                level,
                total_lessons,
                total_weeks,
                categories(name)
            `);

        if (error) {

            console.error(error);

            courseGrid.innerHTML =
                `<div class="crse-gac-empty-state">
                    Error loading courses
                </div>`;

            return;

        }

        console.log(data);

        allCourses = data.map(item => ({

            id: item.id,

            name: item.name,

            description: item.description,

            logo: item.logo_url,

            tint: item.tint || "#eeecff",

            level: item.level,

            lessons: item.total_lessons || 0,

            duration: `${item.total_weeks || 0} weeks`,

            category:
                Array.isArray(item.categories)
                    ? item.categories[0]?.name || "Uncategorized"
                    : item.categories?.name || "Uncategorized"

        }));

        renderCourses();

    }

    // ===============================
    // Render Courses
    // ===============================
    function renderCourses() {

        const query = searchInput.value.trim().toLowerCase();

        const filtered = allCourses.filter(course => {

            const filterMatch =
                selectedFilter === "All" ||
                course.category === selectedFilter;

            const searchMatch =
                course.name.toLowerCase().includes(query) ||
                course.description.toLowerCase().includes(query) ||
                course.category.toLowerCase().includes(query);

            return filterMatch && searchMatch;

        });

        if (!filtered.length) {

            courseGrid.innerHTML =
                `<div class="crse-gac-empty-state">
                    No Courses Found
                </div>`;

            return;

        }

        courseGrid.innerHTML = filtered.map((course, index) => `

            <article
                class="crse-gac-course-card"
                style="
                    --crse-gac-card-tint:${course.tint};
                    animation-delay:${index*70}ms;
                ">

                <div class="crse-gac-card-top">

                    <div
                        class="crse-gac-course-logo"
                        style="--crse-gac-card-tint:${course.tint};">

                        <img
                            src="${course.logo}"
                            alt="${course.name}"

                            onerror="this.style.display='none';">

                    </div>

                    <span class="crse-gac-level-badge">
                        ${course.level}
                    </span>

                </div>

                <h3>${course.name}</h3>

                <p>${course.description}</p>

                <div class="crse-gac-course-meta">

                    <span>📘 ${course.lessons} lessons</span>

                    <span>🕒 ${course.duration}</span>

                </div>

                <div class="crse-gac-card-bottom">

                    <button
                        class="crse-gac-start-btn"
                        onclick="startCourse('${course.id}')">

                        Start Course

                    </button>

                </div>

            </article>

        `).join("");

    }

    // ===============================
    // Search
    // ===============================
    searchInput.addEventListener("input", renderCourses);

    // ===============================
    // Start Course
    // ===============================
    window.startCourse = function (id) {

        window.location.href = `abc.html?course_id=${id}`;

    };

    // ===============================
    // Init
    // ===============================
    await loadCategories();
    await loadCourses();

};