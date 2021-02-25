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
                value: '1,500,000',
                info: 'Toronto - Canada',
                owner: 'Felipe',
            },
            {
                type: 'Condo',
                value: '500,000',
                info: 'Madrid - Spain',
                owner: 'Mattew',
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

    async createAsset(ctx, assetNumber, type, value, info, owner) {
        console.info('============= START : Create asset ===========');

        const asset = {
            type,
            docType: 'asset',
            value,
            info,
            owner,
        };

        await ctx.stub.putState(assetNumber, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : Create asset ===========');
    }

    async queryAllassets(ctx) {
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

    async changeAssetOwner(ctx, assetNumber, newOwner) {
        console.info('============= START : changeAssetOwner ===========');

        const assetAsBytes = await ctx.stub.getState(assetNumber); // get the asset from chaincode state
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetNumber} does not exist`);
        }
        const asset = JSON.parse(assetAsBytes.toString());
        asset.owner = newOwner;

        await ctx.stub.putState(assetNumber, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : changeAssetOwner ===========');
    }

}

module.exports = Asset;
