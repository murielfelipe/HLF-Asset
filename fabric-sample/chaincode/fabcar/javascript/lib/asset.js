/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Asset extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const assets = [
            {
                type: 'House',
                price: '1.500.000',
                owner: 'Felipe',
            },
            {
                type: 'Condo',
                price: '1.000.000',
                owner: 'Laura',
            },
        ];

        for (let i = 0; i < assets.length; i++) {
            assets[i].docType = 'asset';
            await ctx.stub.putState('ASSET' + i, Buffer.from(JSON.stringify(assets[i])));
            console.info('Added <--> ', assets[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryAsset(ctx, assetNumber) {
        const assetAsBytes = await ctx.stub.getState(assetNumber); // get the asset from chaincode state
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetNumber} does not exist`);
        }
        console.log(assetAsBytes.toString());
        return assetAsBytes.toString();
    }

    async createAsset(ctx, carAsset, type, price, owner) {
        console.info('============= START : Create Asset ===========');

        const asset = {
            docType: 'asset',
            type,
            price,
            owner,
        };

        await ctx.stub.putState(carAsset, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : Create Asset ===========');
    }

    async queryAllAssets(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, assetNumber, newOwner) {
        console.info('============= START : changeAssetOwner ===========');

        const AssetAsBytes = await ctx.stub.getState(assetNumber); // get the car from chaincode state
        if (!AssetAsBytes || AssetAsBytes.length === 0) {
            throw new Error(`${assetNumber} does not exist`);
        }
        const car = JSON.parse(AssetAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(assetNumber, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : changeAssetOwner ===========');
    }

}

module.exports = Asset;
