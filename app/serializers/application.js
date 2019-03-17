import { isArray } from '@ember/array';
import DS from 'ember-data';
import { registerWarnHandler } from '@ember/debug';

registerWarnHandler((message, { id }, next) => {
  if (id !== "ds.store.push-link-for-sync-relationship") {
    next();
  }
});

let knownReferences = function(documents) {
  return documents.reduce((map, document) => {
    map[`${document.type}:${document.id}`] = true;
    return map;
  }, {});
};

let linkedReferences = function(documents) {
  return documents
    .filter(document => document.relationships)
    .reduce((all, document) => {
      let keys = Object.keys(document.relationships);
      let references = keys.reduce((found, key) => {
        let relationship = document.relationships[key];
        return relationship.data ? found.concat(relationship.data) : found;
      }, []);

      return all.concat(references);
    }, []);
}

let notIn = function(map) {
  return function(data) {
    return !map[`${data.type}:${data.id}`];
  };
};

let objEqual = function(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

let findRelationshipNameReferencingResourceIdentifier = function(document, resourceIdentifier) {
  let relationshipNames = Object.keys(document.relationships || {});

  return relationshipNames.find(name => {
    let relationship = document.relationships[name];

    if (isArray(relationship.data)) {
      return relationship.data.any(candidate => objEqual(candidate, resourceIdentifier));

    } else if (relationship.data) {
      return objEqual(relationship.data, resourceIdentifier);

    }
  });
}

let cleanDocument = function(document, missing) {
  let type = missing.type;
  let id = missing.id;
  let isLink = function(data) {
    return data.type === type && data.id === id;
  };

  let name = findRelationshipNameReferencingResourceIdentifier(document, missing);
  let related = document.relationships[name].data;

  if (isArray(related)) {
    let index = related.findIndex(isLink);
    related.splice(index, 1);

    // dont push an empty data array
    if (related.length === 0) {
      delete document.relationships[name].data;
    }
  } else {
    document.relationships[name] = { data: null };
  }

}

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, payload) {
    let included = payload.included || [];
    let documents = included.concat(payload.data);

    linkedReferences(documents)
      .filter(notIn(knownReferences(documents)))
      .forEach(missing => {
        let badDocument = documents.find(document => findRelationshipNameReferencingResourceIdentifier(document, missing));
        cleanDocument(badDocument, missing);
      });

    return this._super(...arguments);
  }
});
