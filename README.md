# Why is your solution so simple?
Yes, this solution is very simple.

And this is by design. Simplicity could be translated directly into low psychological burden for application developers and low cost of maintenance for platform/DevOps engineers.

- We don't have to manage region/network/VPC/SG, all of which are taken care of by CloudFlare.
- we don't have to provision/upgrade/patch/decommission virtual machines. CloudFlare invokes workers on the nodes near the clients where requests arrive.
- Cloudflare also takes care of sub-domains and certificates, in sharp contrast to AWS where you have to learn [a dedicated service](https://aws.amazon.com/certificate-manager/?nc=sn&loc=1) to manage certificates, usually after you are hit by an catastrophic incident.
- There are not many v1alpha1 APIs which break every time you upgrade, as with Kubernetes. CloudFlare promises [Back Compatibility](https://blog.cloudflare.com/backwards-compatibility-in-cloudflare-workers/).
- CI/CD is easy. To release a new version, all you need to do is to merge a PR into [main branch](https://github.com/lipingtababa/trdl). [Github Actions](./.github/workflows/service.yml) and [CloudFlare Wrangler](https://developers.cloudflare.com/workers/wrangler/commands/#deploy) will ensure the system is upgraded safely.

# Assumptions
Architecture design starts with requirement analysis. Here I make some assumptions about the requirements, which act as a starting point and should be revisited iteratively.

- The website will keep being simple in terms of business logics, fit into a nano service.

- High Availability is the key metric

- Maintainability is of great importance.

# Implementation 
## CloudFlare Worker as the main runtime
Besides the reasons aforementioned, CloudFlare is affordable. Running a CDN distribution, an ALB, a TLS certificate, a Kubernetes cluster, a simple service,  an ElasticCache on AWS for 1 week probably costs me 30 USD, while running it on CloudFlare Worker costs basically nothing.

## Github Actions as the pipeline-as-a-service provider
GitHub Actions is flexible enough to support various workflows, but not too flexible to confuse developers. It also pays great attention to security. Last but not least, it is a managed service, so maintenance is offloaded.

# How can I deploy it ?

As an application developer, one can always use "yarn dev" to start a local simulator and use "yarn test" to run unit test suite.

However, it is strongly advised NOT to copy the code and deploy it somewhere. A good practice is that all the deployments are managed by [GitHub Actions workflows](./.github/workflows/service.yml), which acts as the source of truth in term of deployments.

In case one really needs to copy the code and deploy it somewhere else, [CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID](./.github/workflows/service.yml#38) are the only parameters to update.

# TODO
## Observability
- To collect logs. Probably [tail worker](https://developers.cloudflare.com/workers/runtime-apis/handlers/tail/) is a good candidate.
- To collect customized metrics. Probably Datadog is a good choice.

## Test
- Add E2E test suite.

## Cost Optimization
- Use a static site to serve the fixed 42 response.

## Extension of Functionalities
- Implement the `/api` endpoint.
