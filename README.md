# Why is your solution so simple?
Yes, this solution is quite simple. Too simple, some would say. And this is by design. Simplicity could be translated directly into low psychologic burden for application developers and low cost of maintenance for platform/DevOps engineers.

- There is no region/network/VPC/SG to manage, all of which are taken care of by CloudFlare.
- There is no virtual machines to manage. CloudFlare invokes the worker on the nodes near the clients where requests arrive.
- Cloudflare also takes care of sub-domains and certificates, in sharp contrast to AWS where managing certificates involves huge fees or huge incidents.
- There are not much v1alpha1 APIs which break everytime you upgrade, as with Kubernetes. Check out CloudFlare's [Back Compatibility](https://blog.cloudflare.com/backwards-compatibility-in-cloudflare-workers/)
- CI/CD is easy. To release a new version, all you need to do is to merge the PR into main branch. Github Actions and CloudFlare will ensure your code is upgraded safely.

# Assumptions
Architecture design starts with requirement analysis. Here I make some assumptions about the requirements, which acts as a starting point and should be revisited interatively.

- The website will keep being simple in term of business logics. For example, we don't expect it to be a e-commerce site.

- High Availability is the key metric

- Maintenability is of great importance.

# Implementation 
## CloudFlare Worker
Besides the reasons aforementioned, CloudFlare is affordable. Running a CDN distribution, an ALB, an TLS certificate, a Kubernetes cluster, a simple service,  an ElasticCache on AWS for 1 week probably costs me 30 USD. Running it on CloudFlare Worker costs basically nothing.

## CloudFlare Worker KV

## Github Actions
Github Actions is flexible enough to support various work flows, but not too flexbile to confuse developers. It also pays great attention to security. Last but not least, it is a managed service, so maintenance is offloaded.

# Why can't I deploy the code in my computer?

As an application developer, You can always use "yarn dev" and "yarn test" to simulate the runtime. However, it is strongly advised not to copy the code and deploy it somewhere. Instead, all the deployments SHOULD be managed by github workflows, which acts as the source of truth in term of deployments.

# TODO
## Observability
- To collect logs. Probably [tail worker](https://developers.cloudflare.com/workers/runtime-apis/handlers/tail/) is a good candidate.
- To collect customized metrics. Probably Datadog is a good choice.

## Cost optimization
- Use static site to serve the fixed 42 response.

