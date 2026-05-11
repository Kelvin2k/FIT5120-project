# AnkhangLife (FIT5120 Project)

AnkhangLife is a full-stack web application that supports learning and daily-life navigation content through a modern front end and a Spring Boot backend. The app combines structured learning modules, practical guides, and facility discovery features to deliver a single place for users to explore essential topics and services.

## Key features

- Learning English with flashcards and optional pronunciation assessment
- Social norms guidance (meeting people, eating out)
- Navigate life guides (public transport, Myki, bus, train, tram, groceries, medical attention)
- Facility and event discovery with detail pages
- Safety information content
- Interactive experiences like quizzes and a chatbot
- Multi-language UI support

## Architecture and tech stack

### Front end

- Vue 3, Vite, Vue Router, Pinia
- UI and UX: Element Plus, Bootstrap, AOS
- Data and maps: Axios, Leaflet, Leaflet Routing Machine
- i18n: Vue I18n

### Back end

- Spring Boot 3.2 (Java 17)
- JDBC, MyBatis Plus
- MySQL
- External data sources (Melbourne open data and Google Places API)

## Project structure

- [FrontEnd_FIT5120](FrontEnd_FIT5120): Vue 3 application, UI, routing, services, and public data assets
- [BackEnd_FIT5120](BackEnd_FIT5120): Spring Boot service with facility data, database access, and APIs
- [FrontEnd_FIT5120/public](FrontEnd_FIT5120/public): CSV and JSON assets for learning and navigation pages

## Requirements

- Node.js 20.19+ or 22.12+ (see [FrontEnd_FIT5120/package.json](FrontEnd_FIT5120/package.json))
- Java 17 and Maven
- MySQL (if running the backend locally)

## Quick start

### Front end

```sh
cd FrontEnd_FIT5120
npm install
npm run dev
```

### Back end

```sh
cd BackEnd_FIT5120
mvn spring-boot:run
```

The backend runs on port 5566 with the /api context path by default.

## Configuration

### Backend configuration

Edit [BackEnd_FIT5120/src/main/resources/application.yml](BackEnd_FIT5120/src/main/resources/application.yml) or [BackEnd_FIT5120/src/main/resources/application.properties](BackEnd_FIT5120/src/main/resources/application.properties) to set:

- Database URL, username, and password
- Server port and context path
- Google Places API key via the GOOGLE_PLACES_API_KEY environment variable

Avoid committing real credentials. Use environment variables or local overrides for secrets.

### Frontend configuration

Update the API base URL in:

- [FrontEnd_FIT5120/src/config/api.js](FrontEnd_FIT5120/src/config/api.js)
- [FrontEnd_FIT5120/src/services/api.js](FrontEnd_FIT5120/src/services/api.js)

For pronunciation assessment configuration, see the documentation index in [FrontEnd_FIT5120/DOCS_INDEX.md](FrontEnd_FIT5120/DOCS_INDEX.md).

## Documentation

Detailed documentation for pronunciation assessment and setup can be found in:

- [FrontEnd_FIT5120/DOCS_INDEX.md](FrontEnd_FIT5120/DOCS_INDEX.md)

## Routes overview

This is a high-level map of the main routes defined in the front end router:

- /: Home
- /facilities and /FacilityEvent: Facilities and events listing
- /facility/:id: Facility detail page
- /learnenglish: Learning English landing page
- /flashcards/:category/:language: Flashcards by category and language
- /socialnorms: Social norms landing page
- /socialnorms/meetingpeople: Meeting people guidance
- /socialnorms/eatingout: Eating out guidance
- /navigatelife: Navigate life landing page
- /publicTransportation: Public transport overview
- /mykicardlearning: Myki card guide
- /buslearning: Bus guide
- /trainlearning: Train guide
- /tramlearning: Tram guide
- /grocceriesShopping: Groceries shopping guide
- /medicalAttention: Medical attention guide
- /safety: Safety page
- /quiztaking: Quiz experience
- /chatbot: Chatbot page
- /notfound: 404 page

## Data assets

Static data files are stored under the front end public folder and loaded by learning and navigation pages:

- [FrontEnd_FIT5120/public/Learning about Australia](FrontEnd_FIT5120/public/Learning%20about%20Australia)
- [FrontEnd_FIT5120/public/Learning English](FrontEnd_FIT5120/public/Learning%20English)

## Useful scripts

From FrontEnd_FIT5120:

- npm run dev: development server
- npm run build: production build
- npm run preview: preview production build
- npm run lint: lint and fix
- npm run format: format source files

From BackEnd_FIT5120:

- mvn spring-boot:run: run backend locally
- mvn test: run backend tests

## Deployment notes

- Build the front end with npm run build and serve the dist output.
- Deploy the backend as a Spring Boot service or jar.
- Update the frontend API base URL to point at the production backend.

## Contributing

1. Create a new branch for your changes.
2. Keep changes focused and documented.
3. Run linting or tests when applicable.

## License

No license has been specified yet. Add a LICENSE file if you plan to open source this project.
