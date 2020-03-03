
# 🌐 geolocker

_A spatial data registry on Ethereum and 3Box_

## Demo

Make sure you have metamask installed with some test ether and are connected to the Ethereum Ropsten testnet.

```
git clone https://github.com/johnx25bd/ethlondon.git
cd ethlondon/app && npm install
npm start
```

You'll need to sign into 3Box with your private key (with metamask). You can then upload the `demo-geojson.json` file into the drop zone and see it load onto the map. Registering will write the file to 3Box (IPFS) and register the zone on our contract on Ropsten.

We've also built an admin page where authorities can approve zones that are uploaded within their jurisdictions.

## Inspiration

Where we are matters. Everywhere we go, we exist within a jurisdiction, which has the authority to make and enforce the rules we have to live by while we are there.

With location-aware connected devices, where we are becomes part of our digital identity. Our location affects the way our devices behave - what search results are returned - even, sometimes, what websites we can access.

Autonomous vehicles bring a new level of importance to accurately detecting and object's location, and governing it appropriately.

Geolocker is a spatial data registry built on Ethereum and IPFS. We created the system so individuals and, more often, organizations like governments and companies could autonomously and transparently make location data about their policy zones available.

## What it does

With geolocker, entities like local governments or firms can register a geometry on Ethereum. They name the zone - say, "London Congestion Zone". Critical data about the registration is written to a contract on Ethereum, and geodata is stored on IPFS using 3box.

If someone tries to register a geometry that is **inside** a geometry already registered, the owner of that parent zone has to approve the registration before it is approved and accepted into the registry. In this way hierarchies can be created - London zones must be approved by the UK zone owner.

## How we built it

We built Geolocker using React, 3box, Solidity, metamask, mapbox-gl.js and turf.js.

## Challenges we ran into

Working with geospatial data carries its own challenges on the decentralized web, mainly related to scale and computational complexity. Storing and computing spatial data on chain is rarely ideal. For this reason we pushed crucial spatial computations into the browser using Turf.js, and opted to store GeoJSON objects on IPFS using 3box. We also ran into many hang-ups writing Solidity, as usual ...

## Accomplishments that we're proud of

We came with a very vague idea of what we wanted to build. We'd discussed the idea for a bit but had not thought about implementing it on Ethereum until yesterday. We made a plan and implemented it in really just a few hours - building a functional interactive dashboard and deploying contracts on the Ropsten testnet.

## What we learned

Geolocker is mainly designed to serve as a bridge between governments and autonomous vehicle manufacturers. These connected vehicles will travel in various jurisdictions - driving or sailing from country to country. The massive complexity created by requiring each vehicle manufacturer to interface with systems to alert local governments to their position when they drive into a new city mean that all but the most [well-resourced manufacturers](https://www.dji.com/de/flysafe/geo-map) simply won't bother. And it is unrealistic to expect governments to try to push their spatial data - which changes when, say, a new airport is built - out to every autonomous vehicle in their territory.

Some global bridge between companies and governments would reduce the complexity of this system massively. Vehicles would need to connect to one place to get relevant geospatial data, no matter where they are in the world. Governments would need to keep one repository of spatial data and associated policies current - and would be able to do so autonomously.

## What's next for geolocker

We built geolocker as a part of a much larger blockchain project called [Hyperaware]([https://github.com/jason-james/LBL-FutureOfBlockchain2020](https://github.com/jason-james/LBL-FutureOfBlockchain2020)). With Hyperaware, connected sensors have policies enforced based on where they are on Earth: when a truck or a ship drives into a congestion zone or port, fees are automatically charged, appropriate people are alerted, access is granted to data and so on. Next we will integrate Geolocker into Hyperaware as the Zone Registry. Beyond that we would love to speak with land registry authorities about how they might use blockchain and decentralized web technologies to help them.
