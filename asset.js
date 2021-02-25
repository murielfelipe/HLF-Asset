/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabAsset extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const asset = [
            {
                type: 'House',
                value: '1.500.000',
                description: 'Toronto - Canada',
                owner: 'Felipe'
            },
            {
                type: 'Condo',
                value: '500.000',
                description: 'Madrid - Spain',
                owner: 'Mattew'
            },
            {
                type: 'House',
                value: '2.500.000',
                description: 'Rome - Italy',
                owner: 'Tarun'
            },
            {
                type: 'Car',
                value: '250.000',
                description: 'Ferrari',
                owner: 'Shaun'
            },
            
        ];

        for (let i = 0; i < asset.length; i++) {
            asset[i].docType = 'asset';
            await ctx.stub.putState('ASSET' + i, Buffer.from(JSON.stringify(asset[i])));
            console.info('Added <--> ', asset[i]);
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

    async createAsset(ctx, assetNumber, make, model, color, owner) {
        console.info('============= START : Create asset ===========');

        const asset = {
            color,
            docType: 'asset',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(assetNumber, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : Create asset ===========');
    }

    async queryAllasset(ctx) {
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
        console.info('============= END : changeassetOwner ===========');
    }

}

module.exports = FabAsset;
