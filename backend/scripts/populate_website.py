import requests
import os

BACKEND_URL = os.getenv("BACKEND_URL") or "http://localhost:8000"

candidates = [
    {
        "name": "John Doe",
        "age": 25,
        "email": "john.doe@gmail.com",
        "password": "name123@!",
        "description": "Je cherche un stage dans le développement web.",
        "pronouns": "il/lui",
        "photo_url": "./john_doe_photo.jpeg",
    },
    {
        "name": "Mary Jane",
        "age": 22,
        "email": "mary.jane@gmail.com",
        "password": "name123@!",
        "description": "Je cherche un emploi dans la restauration.",
        "pronouns": "elle/elle",
        "photo_url": "./mary_jane_photo.jpeg",
    },
]

companies = [
    {
        "name": "Google",
        "email": "google@gmail.com",
        "password": "google123@!",
        "description": "Google est une entreprise américaine spécialisée dans les services Internet et les logiciels.",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    },
    {
        "name": "McDonald's",
        "email": "mcdo@mcdonalds.com",
        "password": "mcdo123@!",
        "description": "McDonald's est une chaîne de restauration rapide américaine.",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
    },
]

offers = [
    {
        "company": "Google",
        "offer": {
            "title": "Stage développeur web",
            "description": "Google recherche un stagiaire en développement web.",
            "skills": ["Python", "Django", "FastAPI"],
            "location": "Paris 9e",
            "salary": 2500,
            "time": "Stage",
            "start_time": "Février 2023",
        }
    },
    {
        "company": "McDonald's",
        "offer": {
            "title": "Serveur polyvalent",
            "description": "McDonald's recherche un serveur polyvalent en restauration rapide.",
            "skills": ["Service", "Polyvalence"],
            "location": "Le Kremlin-Bicêtre",
            "salary": 1600,
            "time": "Contrat à durée indéterminée",
            "start_time": "Maintenant",
        }
    },
]

candidacies = [
    {
        "candidate": "John Doe",
        "candidacy": {
            "offer_id": 1,
            "cover_letter_url": "./cover_letter.pdf",
            "resume_url": "./resume.pdf",
        }
    },
    {
        "candidate": "Mary Jane",
        "candidacy": {
            "offer_id": 2,
            "cover_letter_url": "./cover_letter.pdf",
            "resume_url": "./resume.pdf",
        }
    }
]

def upload_image(image_path, backend_path, headers=None):
    with open(image_path, 'rb') as image:
        return requests.post(f'{BACKEND_URL}{backend_path}', files={'file': image}, headers=headers).json()

# Get credentials for company or candidate
def get_user_credentials(username, user_array):
    for user in user_array:
        if user['name'] == username:
            return user['email'], user['password']
    raise ValueError("User (candidate/company) not found")

def login(email, password):
    response = requests.post(f'{BACKEND_URL}/account/login', json={'email': email, 'password': password})
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print(f"Login failed for {email}: {response.text}")

# ------------------------- MAIN -------------------------

def main():
    print(f'------ Populating website at {BACKEND_URL} -------')

    print("--- Creating candidates ---")

    for candidate in candidates:
        candidate['photo_url'] = upload_image(candidate['photo_url'], '/candidates/uploadImage')['filename']
        response = requests.post(f'{BACKEND_URL}/candidates', json=candidate)
        if response.status_code == 200:
            print(f"- {candidate['name']} created")
        else:
            print(f"- {candidate['name']} creation failed: {response.text}")

    print("--- Creating companies ---")

    for company in companies:
        if not company['photo_url'].startswith(('http', 'https')):
            company['photo_url'] = upload_image(company['photo_url'], '/companies/uploadImage')['filename']

        response = requests.post(f'{BACKEND_URL}/companies', json=company)
        if response.status_code == 200:
            print(f"- {company['name']} created")
        else:
            print(f"- {company['name']} creation failed: {response.text}")

    print("--- Creating offers ---")

    for offer in offers:
        # Login as company
        access_token = login(*get_user_credentials(offer['company'], companies))
        headers = {'Authorization': f'Bearer {access_token}'}
        # Create offer
        response = requests.post(f'{BACKEND_URL}/offers', json=offer['offer'], headers=headers)
        if response.status_code == 200:
            print(f"- {offer['offer']['title']} by {offer['company']} created")
        else:
            print(f"- {offer['offer']['title']} creation failed: {response.text}")

    print("--- Creating candidacies ---")

    for candidacy in candidacies:
        # Login as candidate
        access_token = login(*get_user_credentials(candidacy['candidate'], candidates))
        headers = {'Authorization': f'Bearer {access_token}'}
        # Create candidacy
        candidacy['candidacy']['resume_url'] = upload_image(candidacy['candidacy']['resume_url'], '/candidacies/upload_resume', headers)['filename']
        candidacy['candidacy']['cover_letter_url'] = upload_image(candidacy['candidacy']['cover_letter_url'], '/candidacies/upload_cover_letter', headers)['filename']
        response = requests.post(f'{BACKEND_URL}/candidacies', json=candidacy['candidacy'], headers=headers)
        if response.status_code == 200:
            print(f"- Candidacy by {candidacy['candidate']} created")
        else:
            print(f"- Candidacy creation failed: {response.text}")

if __name__ == "__main__":
    main()
