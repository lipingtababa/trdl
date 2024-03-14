# Implementing a Simple, Highly-Available Website with Cloudflare

# Assumptions of Requirements
Architecture design starts with requirement analysis. Here I make some assumptions about the requirements, which act as a starting point and should be revisited iteratively.

- The website will keep being simple, fit into a nano service.

- High Availability is the key metric.

- Maintainability is of great importance.

# Why a CDN-Based Approach
While containerization and orchestration are prevalent, their complexity can be excessive for a deliberately simple website. A Content Delivery Network (CDN) offers specific advantages for this use case:

- Simplified Operations: Cloudflare's managed infrastructure significantly reduces operational overhead, which is detailed discussed later in this document.

- Inherent High Availability: A CDN's global infrastructure provides built-in redundancy and resilience.

- Cost-Effectiveness: For a simple website, a CDN can offer a more streamlined cost model.

# Containerization Use Cases

Containers remain valuable for more complex projects. Examples from my portfolio include:

- [IDP](https://github.com/lipingtababa/Internal-Developer-Platform) runs on AWS Elastic Kubernetes Service, and tries to provide a reference implementation of [Internal Developer Platform](https://internaldeveloperplatform.org/) to teams that manage hundreds of micro services, with a focus on enforcing good infrastructure architecture of web services.

- [Account](https://github.com/lipingtababa/account) runs on AWS Elastic Container Service, and consists of 5 micro-services, with Cloud Map as the service discovery tool.

- [Bullets](https://github.com/lipingtababa/bullets), runs on AWS Elastic Container Service too, and has a very similar API as TRDL. It can run on a Minikube instance too.

# Implementation 
## CloudFlare provides Worker as the main runtime
As mentioned before, CloudFlare Worker simplify the operation significantly.
- We don't have to manage region/network/VPC/SG, all of which are taken care of by CloudFlare.

- we don't have to provision/upgrade/patch/decommission virtual machines. CloudFlare invokes workers on the nodes near the clients where requests arrive.

- Cloudflare also takes care of sub-domains and certificates, in sharp contrast to AWS where you have to learn [a dedicated service to certificates](https://aws.amazon.com/certificate-manager/) and [a dedicated service to domains](https://aws.amazon.com/route53/), usually after you are hit by an catastrophic incident.

- There are not many v1alpha1 APIs which break every time you upgrade, as with Kubernetes. CloudFlare promises [Back Compatibility](https://blog.cloudflare.com/backwards-compatibility-in-cloudflare-workers/).

Also, CloudFlare has a much simpler and more affordable pricing model. You can never calculate how much a comparable AWS setup would cost (CloudFront distribution, ALB, TLS certificate, EKS cluster, a simple TRDL service,  and ElasticCache). In contrast, Cloudflare Worker costs are quite predictable.

## CloudFlare provides built-in Observability
Given that our business logic is super simple, the http status codes provided by CloudFlare out of box can tell the whole story, mitigating the necessity of advanced observability tools.

Also given the simplicity, log collection will not enhance value but will incur substantial costs. Hence, it is not undertaken.

## Identify and Mitigate Risks to Availability
Considering the simplicity, it's very likely that risks to availability come from the network in stead of internal bugs, in forms of network failures or DDoS attacks.

To mitigate these risks, we have to be able to deploy applications globally, which in turn requires a CDN.

In fact, CloudFlare has such high confidence in their availability that they commit to [a SLA](https://www.cloudflare.com/en-gb/business-sla/) that, while strategically viable within a business context, is technically impossible.

`The Service will serve Customer Content 100% of the time without qualification.`


## Github Actions provides the pipeline as a service
As an application developer, one can always use "yarn dev" to start a local simulator and use "yarn test" to run unit test suite. 

To release a new version, all you need to do is to merge a PR into [main branch](https://github.com/lipingtababa/trdl). [Github Actions](https://github.com/lipingtababa/trdl/actions) and [CloudFlare Wrangler](https://developers.cloudflare.com/workers/wrangler/commands/#deploy) will ensure the system is upgraded safely.

However, it is strongly advised NOT to copy the code and deploy it manually. A good practice is that all the deployments are managed by [GitHub Actions workflows](./.github/workflows/service.yml), which acts as the source of truth in term of deployments.

In case one really needs to copy the code and deploy it somewhere else, he/she should update: 
- [CLOUDFLARE_API_TOKEN](./.github/workflows/service.yml#24) and [CLOUDFLARE_ACCOUNT_ID](./.github/workflows/service.yml#25).
- The KV namespaces specified in [wrangler toml](./wrangler.toml#8)

# TODO
## Test
- ~~Add E2E test suite~~.[Done](./test/e2e.test.ts)

## Cost Optimization
- Use a static site to serve the fixed 42 response.

## Functionalities
- ~~Implement the `/api` endpoint~~. [Done](./src/index.ts#13)
- ~~Implement the POST method.~~ [Done](./src/index.ts#13)
- Add authentication and authorization.
