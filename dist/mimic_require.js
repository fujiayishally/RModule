!function(e){var a,f={paths:[],exports:[]},p={paths:[]};(a=function(e){if("string"==typeof e){var n=f.paths.indexOf(e);if(-1!==n)return f.exports[n];console.error("找不到"+e+"模块！")}else console.error("模块路径应该为字符串")}).define=function(e){var n=new e;f.exports.push(n)},a.use=function(r){if(a.config instanceof Object){var e=p.paths,o=[];if(Array.isArray(e))for(var n=e.length,t=0,i=document.getElementsByTagName("head")[0];t<n;t++){var c=e[t],s=document.createElement("script");s.src=c,o.push(!1),s.onload=function(e,n){return function(){o[e]=!0,f.paths[e]=n,-1===o.indexOf(!1)&&r()}}(t,c),s.onerror=function(){console.error("模块"+c+"加载有误！")},i.appendChild(s)}}else config.warn("mimic_require配置有误")},a.config=function(e){var n,r=Object.prototype.hasOwnProperty;if(e instanceof Object)for(n in p)r.call(e,n)&&(p[n]=e[n]);else console.warn("函数config的参数应该为对象")},e.mimic_require=a}(window||this);