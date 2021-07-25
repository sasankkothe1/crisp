# CRiSP

## Deployment instructions
1. Clone the repository: https://gitlab.lrz.de/seba-master-2021/team-49/prototype.git
2. Run `docker-compose build` .
3. Make sure that there's an `.env` file next to `docker-compose.yml` with the following values defined:
    * `MONGODB_URI` : Mongodb connection uri
    * `JWT_SECRET`  : jwt token secret 
    * `JWT_EXPIRE`  : jwt token duration
    * `AWS_S3_ACCESS_KEY_ID`        : `access_key_id` from AWS S3
    * `AWS_S3_SECRET_ACCESS_KEY`    : `secret_access_key` from AWS S3
    * `AWS_S3_BUCKET`               : Bucket name for AWS S3
    * `STRIPE_SECRET_TEST`          : Stripe key
4. Run `docker-compose up -d`.
5. The containers should start shortly. To make sure everything works fine execute `docker-compose logs`.

## Usage instructions
* Navigate to `localhost` in the browser (specifically `localhost:80`)
* Enjoy CRiSP!

## Teardown instructions
* Run `docker-compose down`.