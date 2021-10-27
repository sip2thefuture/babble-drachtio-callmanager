const expect = require( "chai" ).expect
const callstore = require( "../../lib/store.js" )

describe( "callmanager - store", function() {

  afterEach( function() {
    callstore.clear()
  } )

  it( `simple store`, async function() {
    let dummycall = {
      "uuid": "1",
      "entity": "1234@domain",
      "sip": {
        "callid": "1234",
        "tags": {
          "local": "",
          "remote": "1111"
        }
      }
    }
    await callstore.set( dummycall )
    expect( await callstore.stats() ).to.deep.include( {
      "storebycallid": 1,
      "storebyuuid": 1,
      "storebyentity": 1
    } )
  } )

  it( `call set three calls add entity`, async function() {

    let dummycall1 = {
      "uuid": "1",
      "sip": {
        "callid": "1234",
        "tags": {
          "local": "",
          "remote": "1111"
        }
      }
    }

    let dummycall2 = {
      "uuid": "2",
      "sip": {
        "callid": "224435",
        "tags": {
          "local": "",
          "remote": "1234"
        }
      }
    }

    let dummycall3 = {
      "uuid": "3",
      "sip": {
        "callid": "555666",
        "tags": {
          "local": "",
          "remote": "4321"
        }
      }
    }

    await callstore.set( dummycall1 )
    await callstore.set( dummycall2 )

    expect( await callstore.stats() ).to.deep.include( {
      "storebycallid": 2,
      "storebyuuid": 2,
      "storebyentity": 0
    } )

    dummycall1.entity = "1000@testdomain"
    await callstore.set( dummycall1 )

    expect( await callstore.stats() ).to.deep.include( {
      "storebycallid": 2,
      "storebyuuid": 2,
      "storebyentity": 1
    } )

    await callstore.set( dummycall3 )

    expect( await callstore.stats() ).to.deep.include( {
      "storebycallid": 3,
      "storebyuuid": 3,
      "storebyentity": 1
    } )

    let c = await callstore.getbycallid( dummycall1.sip )
    expect( c.uuid ).to.equal( "1" )

    callstore.delete( dummycall1 )
    callstore.delete( dummycall2 )
    callstore.delete( dummycall3 )

    expect( await callstore.stats() ).to.deep.include( {
      "storebycallid": 0,
      "storebyuuid": 0,
      "storebyentity": 0
    } )
  } )
} )
