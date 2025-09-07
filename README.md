# ArtSense

## Introduction 

During a **48-hour hackathon**, we developed an **AI-powered mobile application** designed to enhance the museum experience and address a significant challenge faced by **small museums**: providing engaging guided tours and audio guides.


<img src="https://github.com/user-attachments/assets/37ab154e-cfd5-4108-a492-61ceda6239da" alt="Screenshot 1" width="1922" height="1080">

[demo.pm4](https://github.com/user-attachments/assets/b8c55704-76f6-459a-9291-0051a08d1c20)



## How It Works

With our **multi-modal image processing architecture**, any museum can upload their collection of artworks and provide as much contextual information as they wish. This allows for a rich, interactive experience for visitors.

Our novel architecture allows the app to **detect multiple pieces of art** within a single photograph, providing the correct contextual information for each one. We also offer an integrated chatbot that provides access to reliable sources, showing them as links so that users can deep dive into the artists or the art itself.

## Technology Behind It

**Despite this being a more UX-oriented hackathon**, all of this was made possible by leveraging a **powerful Large Language Model (LLM)**. To achieve maximum performance, we stored the images in Google Cloud for image processing. This approach allows our architecture to detect images in less than 2 seconds, a significant improvement compared to standard LLM integrations that can take more than 20 seconds. This optimization is crucial for delivering a fast and seamless user experience.





<img width="1922" height="1080" alt="image" src="https://github.com/user-attachments/assets/a36cca26-0b6c-4d70-99ce-d4f2a524a098" />


## Requirements
- Docker;
- Node (npm, npx);

## How to run

### Initialize the backend
```bash
docker compose up --build -d
```

### Run the expo app
```bash
cd frontend
npm install
npx expo start
```

### Scan the QRCode

