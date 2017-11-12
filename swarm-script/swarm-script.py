import csv
import subprocess
import os
import shutil
import time
import sys
from subprocess import Popen,PIPE
from datetime import datetime 

in_js = sys.stdin.readlines()

class SwarmLogger:
    def logs(self,message):
        datenow = datetime.today().strftime('%d-%m-%Y %H:%M:%S')
        with open('/var/www/manage_API/swarm-script/alumni-swarm.log','a+') as logf:
            logf.write(datenow+' || '+message+'\n')

class alumniSwarm:
    swarmLogger = SwarmLogger()
    def deploy_stack(self,institute):
        ins = institute
        command = ["docker-compose","-f","/var/www/manage_API/swarm-script/test.yaml","-p",institute,"up","-d"]
        self.run_command(command)
        self.swarmLogger.logs(" - Deployed "+institute+" stack.")
        self.replace_container(ins)

    def remove_stack(self,institute):
        command = ["docker","rm","-f",institute+"_web_1"]
        self.run_command(command)
        command = ["docker","rm","-f",institute+"_db_1"]
        self.run_command(command)
        command = ["docker","rm","-f",institute+"_api_1"]
        self.run_command(command)
        self.swarmLogger.logs(" - Removed "+institute+" stack.")

    def cp_file_container(self,institute):
        time.sleep(10)
        command = ["docker","cp","/var/www/manage_API/swarm-script/.env ",institute+"_web_1:/src/app/.env"]
        self.run_command(command)
        command = ["docker","restart",institute+"_web_1"]
        self.run_command(command)
    
    def run_command(self, command):
        debugcommand = " - {0}".format(" ".join(command))
        popen = subprocess.Popen(command, stdin=PIPE, stdout=PIPE, stderr=PIPE)
        popen.wait() # wait a little for docker to complete
        print(popen.communicate())
        return popen

    def insert_deployed_stack_info(self,institute,array,app_id):
        app_id = app_id
        array = array.split(',')
        #print (array)
        ids = int(array[0])+1
        #print (type(array[2]))
        api = int(array[2])+1
        web = int(array[3])+1
        db = int(array[4])+1
        ins = institute
        with open('/var/www/manage_API/swarm-script/info.csv','a+') as info:
            fn = ['id','name','api-port','web-port','db-port']
            writer = csv.DictWriter(info,fieldnames=fn)
            writer.writerow({'id': ids,'name': institute,'api-port':api,'web-port':web,'db-port' : db})
            info.close()
        ec = self.env_change(ins,api,web,db)
        print('13.229.93.168:'+str(web))
        #print(app_id)
        self.change_app_id(api,app_id)



    

    def env_change(self,institute,api,web,db):
        ins = institute
        shutil.copy('/var/www/manage_API/swarm-script/test.yaml.example','/var/www/manage_API/swarm-script/test.yaml')
        with open('/var/www/manage_API/swarm-script/test.yaml','r') as f:
            s = f.read()
        with open('/var/www/manage_API/swarm-script/test.yaml', 'w') as f:
            s = s.replace('db-port', str(db))
            s = s.replace('web-port',str(web))
            s = s.replace('api-port',str(api))
            f.write(s)
            f.close()
        self.deploy_stack(ins)

        
    def last_line(self,institute,app_id):
        ins = institute
        res = "bravo"
        app_id = app_id
        count = 0
        with open('/var/www/manage_API/swarm-script/info.csv','r') as f:    
            for row in reversed(list(csv.reader(f))):
                res = ','.join(row)
                if(res != ''):
                    break
        self.insert_deployed_stack_info(ins,res,app_id)
                    
    def replace_container(self,institute):
        shutil.copy('/var/www/manage_API/swarm-script/.env.example','/var/www/manage_API/swarm-script/.env')
        ins = institute
        api = 0
        te = "bravo"
        with open('/var/www/manage_API/swarm-script/info.csv','r') as info:
            reader = csv.reader(info)
            for row in reader:
                res = ','.join(row)
                if(res != ''):
                    res = res.split(',') 
                    te = res[1]  
                    if(te == ins):
                        api = res[2] 
        with open('/var/www/manage_API/swarm-script/.env','r') as env:
            s = env.read()
        with open('/var/www/manage_API/swarm-script/.env','w') as env:
            r = s.replace('api',str(api))
            #print(r)
            env.write(r)
        self.cp_file_container(institute)
        #self.replace_container(ins)
                    
    def change_app_id(self,app_api,app_id):
        print(app_id)
        shutil.copy('/var/www/Senior_Project/env.js.example','/var/www/Senior_Project/env.js')
        with open('/var/www/Senior_Project/env.js','r') as env:
            s = env.read()
        with open('/var/www/Senior_Project/env.js','w') as env:
            s = s.replace('app_id',str(app_id))
            s = s.replace('app_api',str(app_api))
            env.write(s)
        



    def deploy_infra(self,institute,app_id):
        self.last_line(institute,app_id)

    def destroy_infra(self,institute):
        self.remove_stack(institute)


alumniSwarm().deploy_infra(in_js[0].rstrip(),in_js[1].rstrip())
#alumniSwarm().change_app_id(in_js[1].rstrip())

#alumniSwarm().destroy_infra(in_js[0].rstrip())





