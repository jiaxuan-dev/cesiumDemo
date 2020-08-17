define(["./when-cbf8cd21","./Check-35e1a91d","./Math-e66fad2a","./Cartesian2-44433f55","./Transforms-23521d7e","./RuntimeError-f4c64df1","./WebGLConstants-95ceb4e9","./ComponentDatatype-7ee14e67","./GeometryAttribute-b1aaa48a","./GeometryAttributes-90846c5f","./AttributeCompression-170b3be0","./GeometryPipeline-7efc0064","./EncodedCartesian3-86f19ac2","./IndexDatatype-66caba23","./IntersectionTests-4068523d","./Plane-47e9c397","./GeometryInstance-70a15eb5","./arrayRemoveDuplicates-b817241d","./EllipsoidTangentPlane-ae6dc4fa","./OrientedBoundingBox-8109cfe7","./CoplanarPolygonGeometryLibrary-4e6157f5","./ArcType-2b58731c","./EllipsoidRhumbLine-862a2df4","./PolygonPipeline-43196bfb","./PolygonGeometryLibrary-1e472dc9"],function(a,e,t,c,p,r,n,s,u,d,o,m,i,f,y,l,g,b,h,P,G,v,L,C,T){"use strict";function E(e){var t=(e=a.defaultValue(e,a.defaultValue.EMPTY_OBJECT)).polygonHierarchy;this._polygonHierarchy=t,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=T.PolygonGeometryLibrary.computeHierarchyPackedLength(t)+1}E.fromPositions=function(e){return new E({polygonHierarchy:{positions:(e=a.defaultValue(e,a.defaultValue.EMPTY_OBJECT)).positions}})},E.pack=function(e,t,r){return r=a.defaultValue(r,0),t[r=T.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy,t,r)]=e.packedLength,t};var k={polygonHierarchy:{}};return E.unpack=function(e,t,r){t=a.defaultValue(t,0);var n=T.PolygonGeometryLibrary.unpackPolygonHierarchy(e,t);t=n.startingIndex,delete n.startingIndex;var o=e[t];return a.defined(r)||(r=new E(k)),r._polygonHierarchy=n,r.packedLength=o,r},E.createGeometry=function(e){var t=e._polygonHierarchy,r=t.positions;if(!((r=b.arrayRemoveDuplicates(r,c.Cartesian3.equalsEpsilon,!0)).length<3)&&G.CoplanarPolygonGeometryLibrary.validOutline(r)){var n=T.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(t,!1);if(0!==n.length){for(var o=[],a=0;a<n.length;a++){var i=new g.GeometryInstance({geometry:function(e){for(var t=e.length,r=new Float64Array(3*t),n=f.IndexDatatype.createTypedArray(t,2*t),o=0,a=0,i=0;i<t;i++){var y=e[i];r[o++]=y.x,r[o++]=y.y,r[o++]=y.z,n[a++]=i,n[a++]=(i+1)%t}var l=new d.GeometryAttributes({position:new u.GeometryAttribute({componentDatatype:s.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:r})});return new u.Geometry({attributes:l,indices:n,primitiveType:u.PrimitiveType.LINES})}(n[a])});o.push(i)}var y=m.GeometryPipeline.combineInstances(o)[0],l=p.BoundingSphere.fromPoints(t.positions);return new u.Geometry({attributes:y.attributes,indices:y.indices,primitiveType:y.primitiveType,boundingSphere:l})}}},function(e,t){return a.defined(t)&&(e=E.unpack(e,t)),e._ellipsoid=c.Ellipsoid.clone(e._ellipsoid),E.createGeometry(e)}});