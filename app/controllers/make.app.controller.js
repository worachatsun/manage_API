const mongoose = require('mongoose')
const AppMaker = mongoose.model('AppMaker')
const Boom = require('boom')
const shell = require('shelljs')
const PythonShell = require('python-shell')

exports.saveAppInfo = (req, rep) => {
    const { uni_name, uni_abb, uni_th_name, uni_th_abb, color, logo, createdBy } = req.payload
    const { career, donate, event, news } = req.payload.features
    // if (!editorRaw || !title ) {
    //     return rep(Boom.notFound('Connot find raw data of editor.'))
    // }

    const appMaker = new AppMaker({
        uni_name,
        uni_abb,
        uni_th_name,
        uni_th_abb,
        color,
        logo,
        createdBy,
        features: {
            career,
            donate,
            event,
            news
        }
    })

    appMaker.save(function(err) {
        if (err) { return rep(Boom.notFound(err)) }

        var pyshell = new PythonShell('swarm-script.py', { scriptPath: `${__dirname}/../../swarm-script/`} )
        pyshell.send(uni_abb).send(appMaker._id)
        
        pyshell.on('message', function (message) {
            console.log(message)
        })
    
        pyshell.end(function (err) {
            if (err){
                throw err
            }
            console.log('finished')
        })

        const { stdout, stderr, code } = shell.exec(`bash ${__dirname+'/../../gen-android.sh'}`,{silent:true, async:false})
        const stdoutArr = stdout.split('\n')

        AppMaker.findByIdAndUpdate(appMaker._id, {android_download: stdoutArr[stdoutArr.length-2]}, {new: true}, (err, appMaker) => {
            return rep({appMaker})
        })
    })

}

exports.searchAppByUserId = (req, rep) => {
    const { createdBy } = req.payload

    AppMaker.find({ createdBy }, (err, apps) => {
        if(err) { return rep(Boom.notFound(err)) }
        return rep({apps})
    })
}

exports.downloadAndroid = (req, rep) => {
    return rep.file(`${__dirname}/../android_app/${req.params.id}.apk`, {filename: `${req.params.id}.apk`, mode: 'attachment', lookupCompressed: true})
}

exports.downloadIOS = (req, rep) => {
    return rep.file(`${__dirname}/../ios_app/${req.params.id}.zip`, {filename: `${req.params.id}.zip`, mode: 'attachment', lookupCompressed: true})
}

exports.updateAppData = (req, rep) => {
    const { uni_name, uni_abb, uni_th_abb, uni_th_name, features, color, logo, _id } = req.payload

    const updateData = {
        uni_name, 
        uni_abb, 
        uni_th_abb, 
        uni_th_name, 
        features, 
        color, 
        logo
    }

    AppMaker.findByIdAndUpdate(_id, updateData, {new: true}, (err, app) => {
        if(err) { return rep(Boom.notFound(err)) }
        const {createdBy} = app

        AppMaker.find({ createdBy }, (err, apps) => {
            if(err) { return rep(Boom.notFound(err)) }
            return rep({apps})
        })
    })
}

exports.deleteApp = (req, rep) => {
    var pyshell = new PythonShell('destroy_stack.py', { scriptPath: `${__dirname}/../../swarm-script/`} )
    pyshell.send(req.payload._id)
    
    pyshell.on('message', function (message) {
        console.log(message)
    })

    pyshell.end(function (err) {
        if (err){
            throw err
        }
        console.log('finished')
    })

    AppMaker.remove({ _id: req.payload._id }, function (err) {
        if (err) return handleError(err)
        return rep({status: 'removed'})
    })
}

exports.searchAppById = (req, rep) => {
    AppMaker.find({ _id: req.params.id }, (err, apps) => {
        if(err) { return rep(Boom.notFound(err)) }
        return rep({apps})
    })
}

exports.testPython = (req, rep) => {
    var pyshell = new PythonShell('swarm-script.py', { scriptPath: `${__dirname}/../../swarm-script/`} )
    pyshell.send('sun')
    
    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    })

    // PythonShell.run('swarm-script.py', { scriptPath: `${__dirname}/../../swarm-script/`}, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: %j', results);
    // })

    pyshell.end(function (err) {
        if (err){
            throw err;
        };
    
        console.log('finished');
    })
}