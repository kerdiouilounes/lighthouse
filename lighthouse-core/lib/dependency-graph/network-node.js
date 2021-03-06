/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const BaseNode = require('./base-node');
const WebInspector = require('../web-inspector');

class NetworkNode extends BaseNode {
  /**
   * @param {LH.WebInspector.NetworkRequest} networkRecord
   */
  constructor(networkRecord) {
    super(networkRecord.requestId);
    /** @private */
    this._record = networkRecord;
  }

  get type() {
    return BaseNode.TYPES.NETWORK;
  }

  /**
   * @return {number}
   */
  get startTime() {
    return this._record.startTime * 1000 * 1000;
  }

  /**
   * @return {number}
   */
  get endTime() {
    return this._record.endTime * 1000 * 1000;
  }

  /**
   * @return {LH.WebInspector.NetworkRequest}
   */
  get record() {
    return this._record;
  }

  /**
   * @return {?string}
   */
  get initiatorType() {
    return this._record._initiator && this._record._initiator.type;
  }

  /**
   * @return {boolean}
   */
  get fromDiskCache() {
    return !!this._record._fromDiskCache;
  }

  /**
   * @return {boolean}
   */
  hasRenderBlockingPriority() {
    const priority = this._record.priority();
    const isScript = this._record._resourceType === WebInspector.resourceTypes.Script;
    const isDocument = this._record._resourceType === WebInspector.resourceTypes.Document;
    const isBlockingScript = priority === 'High' && isScript;
    const isBlockingHtmlImport = priority === 'High' && isDocument;
    return priority === 'VeryHigh' || isBlockingScript || isBlockingHtmlImport;
  }

  /**
   * @return {NetworkNode}
   */
  cloneWithoutRelationships() {
    const node = new NetworkNode(this._record);
    node.setIsMainDocument(this._isMainDocument);
    return node;
  }
}

module.exports = NetworkNode;
