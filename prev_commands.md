nd its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
2025-08-09T04:50:02.305Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org1.example.com, url:grpcs://peer1.org1.example.com:7051, connected:false, connectAttempted:true
2025-08-09T04:50:02.306Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org1.example.com url:grpcs://peer1.org1.example.com:7051 timeout:3000
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
2025-08-09T04:50:05.316Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true
2025-08-09T04:50:05.316Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server orderer1.example.com url:grpcs://orderer1.example.com:7050 timeout:3000
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
2025-08-09T04:50:08.329Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Discoverer- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T04:50:08.330Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://peer1.org0.example.com:7051 timeout:3000
2025-08-09T04:50:08.330Z - error: [ServiceEndpoint]: ServiceEndpoint grpcs://peer1.org0.example.com:7051 reset connection failed :: Error: Failed to connect before the deadline on Discoverer- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T04:50:08.331Z - error: [DiscoveryService]: send[tenderchannel] - no discovery results
Error: DiscoveryService has failed to return results
    at DiscoveryService.send (D:\InnovaTende007\vars\app\node\node_modules\fabric-common\lib\DiscoveryService.js:335:10)
    at async NetworkImpl._initializeInternalChannel (D:\InnovaTende007\vars\app\node\node_modules\fabric-network\lib\network.js:303:13)
    at async NetworkImpl._initialize (D:\InnovaTende007\vars\app\node\node_modules\fabric-network\lib\network.js:253:9)
    at async Gateway.getNetwork (D:\InnovaTende007\vars\app\node\node_modules\fabric-network\lib\gateway.js:355:9)
    at async connectGateway (D:\InnovaTende007\vars\app\node\main.js:62:19)
    at async run (D:\InnovaTende007\vars\app\node\main.js:90:33)
PS D:\InnovaTende007\vars\app\node> docker port peer1.org0.example.com 7051
Error: No public port '7051' published for peer1.org0.example.com
PS D:\InnovaTende007\vars\app\node> docker inspect peer1.org0.example.com --format "{{json .NetworkSettings.Networks.mysite.IPAddress}}"
"172.18.0.5"
PS D:\InnovaTende007\vars\app\node> docker inspect peer1.org1.example.com --format "{{json .NetworkSettings.Networks.mysite.IPAddress}}"
"172.18.0.7"
PS D:\InnovaTende007\vars\app\node> docker inspect orderer1.example.com --format "{{json .NetworkSettings.Networks.mysite.IPAddress}}"
"172.18.0.2"
PS D:\InnovaTende007\vars\app\node> node -e "const fs=require('fs');let cfg=JSON.parse(fs.readFileSync('connection.json'));cfg.peers['peer1.org0.example.com'].url='grpcs://172.18.0.5:7051';cfg.peers['peer1.org1.example.com'].url='grpcs://172.18.0.7:7051';cfg.orderers['orderer1.example.com'].url='grpcs://172.18.0.2:7050';fs.writeFileSync('connection.json',JSON.stringify(cfg,null,2));console.log('updated-ips');"                                     
updated-ips                                                                                                                                           
PS D:\InnovaTende007\vars\app\node> $env:ORG='org0.example.com'; $env:CHANNEL='tenderchannel'; $env:CHAINCODE='tendercc'; $env:WALLET='D:\InnovaTende007\vars\profiles\vscode\wallets\org0.example.com'; $env:CCP='D:\InnovaTende007\vars\app\node\connection.json'; $env:AS_LOCALHOST='false'; node main.js listBids TDR-000 | cat
2025-08-09T04:51:25.165Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://172.18.0.5:7051, connected:false, connectAttempted:true
2025-08-09T04:51:25.167Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://172.18.0.5:7051 timeout:3000
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
2025-08-09T04:51:28.180Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org1.example.com, url:grpcs://172.18.0.7:7051, connected:false, connectAttempted:true
2025-08-09T04:51:28.180Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org1.example.com url:grpcs://172.18.0.7:7051 timeout:3000
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
2025-08-09T04:51:31.196Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://172.18.0.2:7050, connected:false, connectAttempted:true
2025-08-09T04:51:31.196Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server orderer1.example.com url:grpcs://172.18.0.2:7050 timeout:3000
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
2025-08-09T04:51:34.213Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Discoverer- name: peer1.org0.example.com, url:grpcs://172.18.0.5:7051, connected:false, connectAttempted:true
2025-08-09T04:51:34.213Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://172.18.0.5:7051 timeout:3000
2025-08-09T04:51:34.213Z - error: [ServiceEndpoint]: ServiceEndpoint grpcs://172.18.0.5:7051 reset connection failed :: Error: Failed to connect before the deadline on Discoverer- name: peer1.org0.example.com, url:grpcs://172.18.0.5:7051, connected:false, connectAttempted:true
2025-08-09T04:51:34.214Z - error: [DiscoveryService]: send[tenderchannel] - no discovery results
Error: DiscoveryService has failed to return results
    at DiscoveryService.send (D:\InnovaTende007\vars\app\node\node_modules\fabric-common\lib\DiscoveryService.js:335:10)
    at async NetworkImpl._initializeInternalChannel (D:\InnovaTende007\vars\app\node\node_modules\fabric-network\lib\network.js:303:13)
    at async NetworkImpl._initialize (D:\InnovaTende007\vars\app\node\node_modules\fabric-network\lib\network.js:253:9)
    at async Gateway.getNetwork (D:\InnovaTende007\vars\app\node\node_modules\fabric-network\lib\gateway.js:355:9)
    at async connectGateway (D:\InnovaTende007\vars\app\node\main.js:62:19)
    at async run (D:\InnovaTende007\vars\app\node\main.js:90:33)
PS D:\InnovaTende007\vars\app\node> docker port peer1.org0.example.com && docker port peer1.org1.example.com && docker port orderer1.example.com
PS D:\InnovaTende007\vars\app\node> docker exec peer1.org0.example.com sh -lc "ls -1 /etc/hyperledger/fabric/tls && ls -1 /etc/hyperledger/fabric/msp/tlscacerts"
ca.crt
server.crt
server.key
tlsca1.org0.example.com-cert.pem
PS D:\InnovaTende007\vars\app\node> docker exec peer1.org0.example.com sh -lc "grep -E 'ListenAddress|Address|ExternalEndpoint' -n /etc/hyperledger/fabric/core.yaml || true"
21:    # The Address at local network interface this Peer will listen on.
23:    listenAddress: 0.0.0.0:7051
28:    # chaincodeListenAddress: 0.0.0.0:7052
31:    # If this is not specified, the chaincodeListenAddress address is selected.
32:    # And if chaincodeListenAddress is not specified, address is selected from
36:    # chaincodeAddress: 0.0.0.0:7052
372:        listenAddress: 0.0.0.0:6060
629:       couchDBAddress: 127.0.0.1:5984
706:    listenAddress: 127.0.0.1:9443
PS D:\InnovaTende007\vars\app\node> docker exec peer1.org0.example.com sh -lc "peer channel list 2>&1"                                                
2025-08-09 04:55:51.594 UTC [bccsp] GetDefault -> DEBU 001 Before using BCCSP, please call InitFactories(). Falling back to bootBCCSP.
2025-08-09 04:55:51.603 UTC [bccsp] GetDefault -> DEBU 002 Before using BCCSP, please call InitFactories(). Falling back to bootBCCSP.
2025-08-09 04:55:51.611 UTC [bccsp_sw] openKeyStore -> DEBU 003 KeyStore opened at [/etc/hyperledger/fabric/msp/keystore]...done
2025-08-09 04:55:51.612 UTC [msp] getPemMaterialFromDir -> DEBU 004 Reading directory /etc/hyperledger/fabric/msp/signcerts
2025-08-09 04:55:51.620 UTC [msp] getPemMaterialFromDir -> DEBU 005 Inspecting file /etc/hyperledger/fabric/msp/signcerts/peer1.org0.example.com-cert.pem
2025-08-09 04:55:51.624 UTC [msp] getPemMaterialFromDir -> DEBU 006 Reading directory /etc/hyperledger/fabric/msp/cacerts
2025-08-09 04:55:51.631 UTC [msp] getPemMaterialFromDir -> DEBU 007 Inspecting file /etc/hyperledger/fabric/msp/cacerts/ca1.org0.example.com-cert.pem 
2025-08-09 04:55:51.635 UTC [msp] getPemMaterialFromDir -> DEBU 008 Reading directory /etc/hyperledger/fabric/msp/admincerts
2025-08-09 04:55:51.642 UTC [msp] getPemMaterialFromDir -> DEBU 009 Inspecting file /etc/hyperledger/fabric/msp/admincerts/Admin@org0.example.com-cert.pem
2025-08-09 04:55:51.647 UTC [msp] getPemMaterialFromDir -> DEBU 00a Reading directory /etc/hyperledger/fabric/msp/intermediatecerts
2025-08-09 04:55:51.647 UTC [msp] getMspConfig -> DEBU 00b Intermediate certs folder not found at [/etc/hyperledger/fabric/msp/intermediatecerts]. Skipping. [stat /etc/hyperledger/fabric/msp/intermediatecerts: no such file or directory]
2025-08-09 04:55:51.647 UTC [msp] getPemMaterialFromDir -> DEBU 00c Reading directory /etc/hyperledger/fabric/msp/tlscacerts
2025-08-09 04:55:51.655 UTC [msp] getPemMaterialFromDir -> DEBU 00d Inspecting file /etc/hyperledger/fabric/msp/tlscacerts/tlsca1.org0.example.com-cert.pem
2025-08-09 04:55:51.659 UTC [msp] getPemMaterialFromDir -> DEBU 00e Reading directory /etc/hyperledger/fabric/msp/tlsintermediatecerts
2025-08-09 04:55:51.659 UTC [msp] getMspConfig -> DEBU 00f TLS intermediate certs folder not found at [/etc/hyperledger/fabric/msp/tlsintermediatecerts]. Skipping. [stat /etc/hyperledger/fabric/msp/tlsintermediatecerts: no such file or directory]
2025-08-09 04:55:51.660 UTC [msp] getPemMaterialFromDir -> DEBU 010 Reading directory /etc/hyperledger/fabric/msp/crls
2025-08-09 04:55:51.660 UTC [msp] getMspConfig -> DEBU 011 crls folder not found at [/etc/hyperledger/fabric/msp/crls]. Skipping. [stat /etc/hyperledger/fabric/msp/crls: no such file or directory]
2025-08-09 04:55:51.665 UTC [msp] getMspConfig -> DEBU 012 Loading NodeOUs
2025-08-09 04:55:51.679 UTC [msp] newBccspMsp -> DEBU 013 Creating BCCSP-based MSP instance
2025-08-09 04:55:51.679 UTC [msp] New -> DEBU 014 Creating Cache-MSP instance
2025-08-09 04:55:51.679 UTC [msp] loadLocalMSP -> DEBU 015 Created new local MSP
2025-08-09 04:55:51.679 UTC [msp] Setup -> DEBU 016 Setting up MSP instance org0-example-com
2025-08-09 04:55:51.680 UTC [msp.identity] newIdentity -> DEBU 017 Creating identity instance for cert -----BEGIN CERTIFICATE-----
MIICuTCCAl6gAwIBAgIUN2YiJxE7MQDc54+TTag7AEyVtfswCgYIKoZIzj0EAwIw
cjELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQH
DAdSYWxlaWdoMRkwFwYDVQQKDBBvcmcwLmV4YW1wbGUuY29tMR0wGwYDVQQDDBRj
YTEub3JnMC5leGFtcGxlLmNvbTAeFw0yNTA4MDgxNzM1MTlaFw0zNTA4MDYxNzM1
MTlaMHIxCzAJBgNVBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEQMA4G
A1UEBwwHUmFsZWlnaDEZMBcGA1UECgwQb3JnMC5leGFtcGxlLmNvbTEdMBsGA1UE
AwwUY2ExLm9yZzAuZXhhbXBsZS5jb20wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNC
AATVDfGMpXqB+AFW/H4/gZdFKLIK5ThvZt59412tP06gVgXsB+DgIlFxdINXaJyt
ZpQ9iBDZbaAtWURvsSQVVwgSo4HRMIHOMB0GA1UdDgQWBBSX3w/Uj+iwFWDrisJh
t3iN34axaTAfBgNVHSMEGDAWgBSX3w/Uj+iwFWDrisJht3iN34axaTAPBgNVHRMB
Af8EBTADAQH/MA4GA1UdDwEB/wQEAwIBpjAdBgNVHSUEFjAUBggrBgEFBQcDAQYI
KwYBBQUHAwIwTAYDVR0RBEUwQ4cECv///oIUY2ExLm9yZzAuZXhhbXBsZS5jb22C
FGNhMS1vcmcwLWV4YW1wbGUtY29tgglsb2NhbGhvc3SHBH8AAAEwCgYIKoZIzj0E
AwIDSQAwRgIhAKGmfyznMtv1+w8IN28Uxc9Vq2ETWt2llHiJnr9Bcf61AiEA0ZxT
vEYl6vnAXsclOjGVIxwsQZQDetvpgB6pUAGKNZY=
-----END CERTIFICATE-----
2025-08-09 04:55:51.680 UTC [msp.identity] newIdentity -> DEBU 018 Creating identity instance for cert -----BEGIN CERTIFICATE-----
MIICcDCCAhegAwIBAgIUaPvMfEsh58635Ssgkkl21b7mgfgwCgYIKoZIzj0EAwIw
cjELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQH
DAdSYWxlaWdoMRkwFwYDVQQKDBBvcmcwLmV4YW1wbGUuY29tMR0wGwYDVQQDDBRj
YTEub3JnMC5leGFtcGxlLmNvbTAeFw0yNTA4MDgxNzM1MzRaFw0zNTA1MDgxNzM1
MzRaMGgxCzAJBgNVBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEQMA4G
A1UEBwwHUmFsZWlnaDENMAsGA1UECwwEcGVlcjEfMB0GA1UEAwwWcGVlcjEub3Jn
MC5leGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNxSQwxaIMsw
ysyMgknim9MhKBB25rmg+SDOtyZM9km26ofgp17+pkIBMt8+Q/hfI65+FGKPqvv5
49DzRZGc0iujgZQwgZEwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwUAYD
VR0RBEkwR4cECv///oIWcGVlcjEub3JnMC5leGFtcGxlLmNvbYIWcGVlcjEtb3Jn
MC1leGFtcGxlLWNvbYIJbG9jYWxob3N0hwR/AAABMB8GA1UdIwQYMBaAFJffD9SP
6LAVYOuKwmG3eI3fhrFpMAoGCCqGSM49BAMCA0cAMEQCIHynGWloj5XZUkpnSe1k
Hl5vM74l6Su7yi65cd4/H1zlAiAvL67Ec0Lqbx4jqASSViezoRPpPjRfTLFCojZQ
vHyG8w==
-----END CERTIFICATE-----
2025-08-09 04:55:51.692 UTC [msp.identity] newIdentity -> DEBU 019 Creating identity instance for cert -----BEGIN CERTIFICATE-----
MIICcDCCAhegAwIBAgIUaPvMfEsh58635Ssgkkl21b7mgfgwCgYIKoZIzj0EAwIw
cjELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQH
DAdSYWxlaWdoMRkwFwYDVQQKDBBvcmcwLmV4YW1wbGUuY29tMR0wGwYDVQQDDBRj
YTEub3JnMC5leGFtcGxlLmNvbTAeFw0yNTA4MDgxNzM1MzRaFw0zNTA1MDgxNzM1
MzRaMGgxCzAJBgNVBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEQMA4G
A1UEBwwHUmFsZWlnaDENMAsGA1UECwwEcGVlcjEfMB0GA1UEAwwWcGVlcjEub3Jn
MC5leGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNxSQwxaIMsw
ysyMgknim9MhKBB25rmg+SDOtyZM9km26ofgp17+pkIBMt8+Q/hfI65+FGKPqvv5
49DzRZGc0iujgZQwgZEwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwUAYD
VR0RBEkwR4cECv///oIWcGVlcjEub3JnMC5leGFtcGxlLmNvbYIWcGVlcjEtb3Jn
MC1leGFtcGxlLWNvbYIJbG9jYWxob3N0hwR/AAABMB8GA1UdIwQYMBaAFJffD9SP
6LAVYOuKwmG3eI3fhrFpMAoGCCqGSM49BAMCA0cAMEQCIHynGWloj5XZUkpnSe1k
Hl5vM74l6Su7yi65cd4/H1zlAiAvL67Ec0Lqbx4jqASSViezoRPpPjRfTLFCojZQ
vHyG8w==
-----END CERTIFICATE-----
2025-08-09 04:55:51.692 UTC [msp] setupSigningIdentity -> DEBU 01a Signing identity expires at 2035-05-08 17:35:34 +0000 UTC
2025-08-09 04:55:51.693 UTC [msp.identity] newIdentity -> DEBU 01b Creating identity instance for cert -----BEGIN CERTIFICATE-----
MIICczCCAhigAwIBAgIUaPvMfEsh58635Ssgkkl21b7mgfcwCgYIKoZIzj0EAwIw
cjELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQH
DAdSYWxlaWdoMRkwFwYDVQQKDBBvcmcwLmV4YW1wbGUuY29tMR0wGwYDVQQDDBRj
YTEub3JnMC5leGFtcGxlLmNvbTAeFw0yNTA4MDgxNzM1MjZaFw0zNTA1MDgxNzM1
MjZaMGkxCzAJBgNVBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEQMA4G
A1UEBwwHUmFsZWlnaDEOMAwGA1UECwwFYWRtaW4xHzAdBgNVBAMMFkFkbWluQG9y
ZzAuZXhhbXBsZS5jb20wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAREIjRJFUsO
b0kAbYXOFVpPhjclFtE0dVNWYlnFDVLE7TXUcHObr3HinnviBDJ3e4wKtxeDrE7e
hNhtW2zeK73lo4GUMIGRMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMFAG
A1UdEQRJMEeHBAr///6CFkFkbWluQG9yZzAuZXhhbXBsZS5jb22CFkFkbWluQG9y
ZzAtZXhhbXBsZS1jb22CCWxvY2FsaG9zdIcEfwAAATAfBgNVHSMEGDAWgBSX3w/U
j+iwFWDrisJht3iN34axaTAKBggqhkjOPQQDAgNJADBGAiEA8vr6cgyrFRK4FHbX
KSJ0nKZwi1pukP8m5r7jCcYXjikCIQCbAXytO553FTZSFKr6DldYN7F/uIKmkyBr
tbVVszmn4Q==
-----END CERTIFICATE-----
2025-08-09 04:55:51.693 UTC [msp] hasOURole -> DEBU 01c MSP org0-example-com checking if the identity is a client
2025-08-09 04:55:51.693 UTC [msp] getCertificationChain -> DEBU 01d MSP org0-example-com getting certification chain
2025-08-09 04:55:51.694 UTC [msp] hasOURole -> DEBU 01e MSP org0-example-com checking if the identity is a client
2025-08-09 04:55:51.694 UTC [msp] getCertificationChain -> DEBU 01f MSP org0-example-com getting certification chain
2025-08-09 04:55:51.694 UTC [msp] GetDefaultSigningIdentity -> DEBU 020 Obtaining default signing identity
2025-08-09 04:55:51.698 UTC [grpc] InfoDepth -> DEBU 021 [core]parsed scheme: ""
2025-08-09 04:55:51.698 UTC [grpc] InfoDepth -> DEBU 022 [core]scheme "" not registered, fallback to default scheme
2025-08-09 04:55:51.698 UTC [grpc] InfoDepth -> DEBU 023 [core]ccResolverWrapper: sending update to cc: {[{peer1.org0.example.com:7051  <nil> 0 <nil>}] <nil> <nil>}
2025-08-09 04:55:51.698 UTC [grpc] InfoDepth -> DEBU 024 [core]ClientConn switching balancer to "pick_first"
2025-08-09 04:55:51.698 UTC [grpc] InfoDepth -> DEBU 025 [core]Channel switches to new LB policy "pick_first"
2025-08-09 04:55:51.698 UTC [grpc] InfoDepth -> DEBU 026 [core]Subchannel Connectivity change to CONNECTING
2025-08-09 04:55:51.698 UTC [grpc] InfoDepth -> DEBU 027 [core]Subchannel picks a new address "peer1.org0.example.com:7051" to connect
2025-08-09 04:55:51.699 UTC [grpc] InfoDepth -> DEBU 028 [core]pickfirstBalancer: UpdateSubConnState: 0xc00001b370, {CONNECTING <nil>}
2025-08-09 04:55:51.699 UTC [grpc] InfoDepth -> DEBU 029 [core]Channel Connectivity change to CONNECTING
2025-08-09 04:55:51.701 UTC [comm.tls] ClientHandshake -> DEBU 02a Client TLS handshake completed in 1.594256ms remoteaddress=172.18.0.5:7051
2025-08-09 04:55:51.701 UTC [grpc] InfoDepth -> DEBU 02b [core]Subchannel Connectivity change to READY
2025-08-09 04:55:51.702 UTC [grpc] InfoDepth -> DEBU 02c [core]pickfirstBalancer: UpdateSubConnState: 0xc00001b370, {READY <nil>}
2025-08-09 04:55:51.702 UTC [grpc] InfoDepth -> DEBU 02d [core]Channel Connectivity change to READY
2025-08-09 04:55:51.702 UTC [channelCmd] InitCmdFactory -> INFO 02e Endorser and orderer connections initialized
2025-08-09 04:55:51.702 UTC [msp.identity] Sign -> DEBU 02f Sign: plaintext: 0A9F080A5C08031A0C08D7A9DBC40610...631A0D0A0B4765744368616E6E656C73      
2025-08-09 04:55:51.702 UTC [msp.identity] Sign -> DEBU 030 Sign: digest: 8935B6A6306C37C751C1382D6CCB0E4617609723DB666ACC2900E0F67C8B9690
Channels peers has joined:
tenderchannel
PS D:\InnovaTende007\vars\app\node> cd ../.. && powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing -Uri 'https://raw.githubusercontent.com/hyperledger-labs/minifabric/master/minifab.ps1' -OutFile './minifab.ps1'"                                                Invoke-WebRequest : 404: Not Found                                                                                                                    At line:1 char:1                                                                                                                                      
+ Invoke-WebRequest -UseBasicParsing -Uri 'https://raw.githubuserconten ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebException
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
PS D:\InnovaTende007\vars> powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing -Uri 'https://raw.githubusercontent.com/hyperledger-labs/minifabric/master/minifab' -OutFile './minifab'"      
PS D:\InnovaTende007\vars> type .\minifab | more
#!/bin/bash

[ ! -d "$(pwd)/vars" ] && mkdir vars
if type ip > /dev/null 2>&1; then
  ADDRS=$(ip addr|grep 'inet '|grep -v '\.1/'|tr -s ' '|awk '{$1=$1};1'|cut -d ' ' -f 2|cut -d '/' -f 1|paste -sd "," -|sed s/addr://g)
else
  ADDRS=$(ifconfig|grep 'inet '|grep -v '\.1 '|tr -s ' '|awk '{$1=$1};1'|cut -d ' ' -f 2|cut -d '/' -f 1|paste -sd "," -|sed s/addr://g)
fi
if [ -f "$(pwd)/spec.yaml" ]; then
  echo "Using spec file: $(pwd)/spec.yaml"
  minifab_opt="${minifab_opt} -v $(pwd)/spec.yaml:/home/spec.yaml"
elif [ -f "$(pwd)/spec.yml" ]; then
PS D:\InnovaTende007\vars> wsl --version
WSL version: 2.5.9.0
Kernel version: 6.6.87.2-1
WSLg version: 1.0.66
MSRDC version: 1.2.6074
Direct3D version: 1.611.1-81528511
DXCore version: 10.0.26100.1-240331-1435.ge-release
Windows version: 10.0.26100.4770
PS D:\InnovaTende007\vars> wsl bash -lc "chmod +x /mnt/d/InnovaTende007/vars/minifab && cd /mnt/d/InnovaTende007 && ./vars/minifab profilegen -c tenderchannel | sed -n '1,120p'"
Using spec file: /mnt/d/InnovaTende007/spec.yaml
Minifab Execution Context:
    FABRIC_RELEASE=2.5.9
    CHANNEL_NAME=tenderchannel
    PEER_DATABASE_TYPE=couchdb
    CHAINCODE_LANGUAGE=go
    CHAINCODE_NAME=simple
    CHAINCODE_VERSION=1.0
    CHAINCODE_INIT_REQUIRED=true
    CHAINCODE_PARAMETERS="init","a","200","b","300"
    CHAINCODE_PRIVATE=false
    CHAINCODE_POLICY=
    TRANSIENT_DATA=
    BLOCK_NUMBER=newest
    EXPOSE_ENDPOINTS=true
    CURRENT_ORG=org0.example.com
    HOST_ADDRESSES=10.255.255.254,172.20.92.118
    TARGET_ENV=DOCKER
    WORKING_DIRECTORY: /mnt/d/InnovaTende007
.....
# Preparing for the following operations: *********************
  verify options, profile generation
.......
# Running operation: ******************************************
  verify options
.
# Verify the organization option ******************************
  Default option org is org0.example.com which does not exist in your spec, use -o to specify one

# STATS *******************************************************
minifab: ok=16  failed=1

real    0m8.764s
user    0m6.791s
sys     0m1.876s
PS D:\InnovaTende007\vars> wsl bash -lc "cd /mnt/d/InnovaTende007 && ./vars/minifab -o org0.example.com profilegen -c tenderchannel | sed -n '1,120p'"

Using spec file: /mnt/d/InnovaTende007/spec.yaml
org0.example.com is a not supported option
PS D:\InnovaTende007\vars> wsl bash -lc "cd /mnt/d/InnovaTende007 && ./vars/minifab -o org0 profilegen -c tenderchannel | sed -n '1,180p'"            
Using spec file: /mnt/d/InnovaTende007/spec.yaml
org0 is a not supported option
PS D:\InnovaTende007\vars> docker pull alpine/socat:latest | cat
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
Get-Content: The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.
PS D:\InnovaTende007\vars> wsl bash -lc "cd /mnt/d/InnovaTende007 && ./vars/minifab profilegen -c tenderchannel -o org0.example.com | sed -n '1,200p'"

Using spec file: /mnt/d/InnovaTende007/spec.yaml
Minifab Execution Context:
    FABRIC_RELEASE=2.5.9
    CHANNEL_NAME=tenderchannel
    PEER_DATABASE_TYPE=couchdb
    CHAINCODE_LANGUAGE=go
    CHAINCODE_NAME=simple
    CHAINCODE_VERSION=1.0
    CHAINCODE_INIT_REQUIRED=true
    CHAINCODE_PARAMETERS="init","a","200","b","300"
    CHAINCODE_PRIVATE=false
    CHAINCODE_POLICY=
    TRANSIENT_DATA=
    BLOCK_NUMBER=newest
    EXPOSE_ENDPOINTS=true
    CURRENT_ORG=org0.example.com
    HOST_ADDRESSES=10.255.255.254,172.20.92.118
    TARGET_ENV=DOCKER
    WORKING_DIRECTORY: /mnt/d/InnovaTende007
.....
# Preparing for the following operations: *********************
  verify options, profile generation
.......
# Running operation: ******************************************
  verify options
.
# Verify the organization option ******************************
  Default option org is org0.example.com which does not exist in your spec, use -o to specify one

# STATS *******************************************************
minifab: ok=16  failed=1

real    0m7.733s
user    0m6.342s
sys     0m1.677s
PS D:\InnovaTende007\vars> wsl bash -lc "cd /mnt/d/InnovaTende007 && ./vars/minifab profilegen -c tenderchannel -o org0.example.com | sed -n '1,160p'"

Using spec file: /mnt/d/InnovaTende007/spec.yaml
Minifab Execution Context:
    FABRIC_RELEASE=2.5.9
    CHANNEL_NAME=tenderchannel
    PEER_DATABASE_TYPE=couchdb
    CHAINCODE_LANGUAGE=go
    CHAINCODE_NAME=simple
    CHAINCODE_VERSION=1.0
    CHAINCODE_INIT_REQUIRED=true
    CHAINCODE_PARAMETERS="init","a","200","b","300"
    CHAINCODE_PRIVATE=false
    CHAINCODE_POLICY=
    TRANSIENT_DATA=
    BLOCK_NUMBER=newest
    EXPOSE_ENDPOINTS=true
    CURRENT_ORG=org0.example.com
    HOST_ADDRESSES=10.255.255.254,172.20.92.118
    TARGET_ENV=DOCKER
    WORKING_DIRECTORY: /mnt/d/InnovaTende007
.....
# Preparing for the following operations: *********************
  verify options, profile generation
.......
# Running operation: ******************************************
  verify options
.
# Verify the organization option ******************************
  Default option org is org0.example.com which does not exist in your spec, use -o to specify one

# STATS *******************************************************
minifab: ok=16  failed=1

real    0m8.128s
user    0m6.753s
sys     0m1.782s
PS D:\InnovaTende007\vars> wsl bash -lc "cd /mnt/d/InnovaTende007 && ./vars/minifab profilegen -c tenderchannel 2>&1 | sed -n '1,200p'"               
Using spec file: /mnt/d/InnovaTende007/spec.yaml
Minifab Execution Context:
    FABRIC_RELEASE=2.5.9
    CHANNEL_NAME=tenderchannel
    PEER_DATABASE_TYPE=couchdb
    CHAINCODE_LANGUAGE=go
    CHAINCODE_NAME=simple
    CHAINCODE_VERSION=1.0
    CHAINCODE_INIT_REQUIRED=true
    CHAINCODE_PARAMETERS="init","a","200","b","300"
    CHAINCODE_PRIVATE=false
    CHAINCODE_POLICY=
    TRANSIENT_DATA=
    BLOCK_NUMBER=newest
    EXPOSE_ENDPOINTS=true
    CURRENT_ORG=org0.example.com
    HOST_ADDRESSES=10.255.255.254,172.20.92.118
    TARGET_ENV=DOCKER
    WORKING_DIRECTORY: /mnt/d/InnovaTende007
.....
# Preparing for the following operations: *********************
  verify options, profile generation
.......
# Running operation: ******************************************
  verify options
.
# Verify the organization option ******************************
  Default option org is org0.example.com which does not exist in your spec, use -o to specify one

# STATS *******************************************************
minifab: ok=16  failed=1

real    0m8.101s
user    0m6.710s
sys     0m1.749s
PS D:\InnovaTende007\vars> docker run --rm --network mysite -v D:\InnovaTende007:/workspace -w /workspace/vars/app/node -e ORG=org0.example.com -e CHANNEL=tenderchannel -e CHAINCODE=tendercc -e WALLET=/workspace/vars/profiles/vscode/wallets/org0.example.com -e CCP=/workspace/vars/app/node/connection.json -e AS_LOCALHOST=false node:22 bash -lc "node -v && npm i --silent && node main.js listBids TDR-001 | cat"
Unable to find image 'node:22' locally
22: Pulling from library/node
e1c9fcf2cd8e: Pull complete
a870a7a19c34: Pull complete
873a4c802874: Pull complete
5c26b6c1d3cc: Pull complete
fb52016f3b79: Pull complete
ebed137c7c18: Pull complete
c2e76af9483f: Pull complete
37f838b71c6b: Pull complete
Digest: sha256:3218f0d1b9e4b63def322e9ae362d581fbeac1ef21b51fc502ef91386667ce92
Status: Downloaded newer image for node:22
v22.18.0
2025-08-09T05:12:57.702Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:12:57.703Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://peer1.org0.example.com:7051 timeout:3000
2025-08-09T05:12:57.705Z - info: [NetworkConfig]: buildPeer - Unable to connect to the endorser peer1.org0.example.com due to Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true       
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (node:internal/timers:588:17)
    at process.processTimers (node:internal/timers:523:7) {
  connectFailed: true
}
2025-08-09T05:13:00.709Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org1.example.com, url:grpcs://peer1.org1.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:13:00.709Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org1.example.com url:grpcs://peer1.org1.example.com:7051 timeout:3000
2025-08-09T05:13:00.710Z - info: [NetworkConfig]: buildPeer - Unable to connect to the endorser peer1.org1.example.com due to Error: Failed to connect before the deadline on Endorser- name: peer1.org1.example.com, url:grpcs://peer1.org1.example.com:7051, connected:false, connectAttempted:true       
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (node:internal/timers:588:17)
    at process.processTimers (node:internal/timers:523:7) {
  connectFailed: true
}
2025-08-09T05:13:03.718Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true
2025-08-09T05:13:03.719Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server orderer1.example.com url:grpcs://orderer1.example.com:7050 timeout:3000
2025-08-09T05:13:03.720Z - info: [NetworkConfig]: buildOrderer - Unable to connect to the committer orderer1.example.com due to Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true        
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (node:internal/timers:588:17)
    at process.processTimers (node:internal/timers:523:7) {
  connectFailed: true
}
2025-08-09T05:13:06.737Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Discoverer- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:13:06.737Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://peer1.org0.example.com:7051 timeout:3000
2025-08-09T05:13:06.737Z - error: [ServiceEndpoint]: ServiceEndpoint grpcs://peer1.org0.example.com:7051 reset connection failed :: Error: Failed to connect before the deadline on Discoverer- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:13:06.737Z - error: [DiscoveryService]: send[tenderchannel] - no discovery results
Error: DiscoveryService has failed to return results
    at DiscoveryService.send (/workspace/vars/app/node/node_modules/fabric-common/lib/DiscoveryService.js:335:10)
    at async NetworkImpl._initializeInternalChannel (/workspace/vars/app/node/node_modules/fabric-network/lib/network.js:303:13)
    at async NetworkImpl._initialize (/workspace/vars/app/node/node_modules/fabric-network/lib/network.js:253:9)
    at async Gateway.getNetwork (/workspace/vars/app/node/node_modules/fabric-network/lib/gateway.js:355:9)
    at async connectGateway (/workspace/vars/app/node/main.js:62:19)
    at async run (/workspace/vars/app/node/main.js:90:33)
PS D:\InnovaTende007\vars> docker run --rm --network mysite busybox nslookup peer1.org0.example.com || docker run --rm --network mysite busybox ping -c 1 peer1.org0.example.com                                                                                                                            
Unable to find image 'busybox:latest' locally
latest: Pulling from library/busybox
90b9666d4aed: Pull complete
Digest: sha256:f9a104fddb33220ec80fc45a4e606c74aadf1ef7a3832eb0b05be9e90cd61f5f
Status: Downloaded newer image for busybox:latest
Server:         127.0.0.11
Address:        127.0.0.11:53

Non-authoritative answer:

Non-authoritative answer:
Name:   peer1.org0.example.com
Address: 172.18.0.5

PS D:\InnovaTende007\vars> docker exec peer1.org0.example.com sh -lc "grep -n 'clientAuth' -n /etc/hyperledger/fabric/core.yaml && openssl x509 -in /etc/hyperledger/fabric/tls/server.crt -noout -text | sed -n '1,60p'"
259:        clientAuthRequired: false
722:        # is enabled. clientAuthRequired requires client certificate authentication
724:        clientAuthRequired: false
sh: openssl: not found
PS D:\InnovaTende007\vars> docker exec peer1.org0.example.com sh -lc "peer chaincode query -C tenderchannel -n tendercc -c '{\"Args\":[\"GetTender\",\"TDR-001\"]}' | sed -n '1,120p'"
Args\:[\GetTender\,\TDR-001\]}' | sed -n '1,120p': line 1: syntax error: unterminated quoted string
PS D:\InnovaTende007\vars> docker exec peer1.org0.example.com sh -lc 'peer chaincode query -C tenderchannel -n tendercc -c "{\"Args\":[\"GetTender\",\"TDR-001\"]}"'
2025-08-09 05:17:09.049 UTC [bccsp] GetDefault -> DEBU 001 Before using BCCSP, please call InitFactories(). Falling back to bootBCCSP.
2025-08-09 05:17:09.062 UTC [bccsp] GetDefault -> DEBU 002 Before using BCCSP, please call InitFactories(). Falling back to bootBCCSP.
2025-08-09 05:17:09.072 UTC [bccsp_sw] openKeyStore -> DEBU 003 KeyStore opened at [/etc/hyperledger/fabric/msp/keystore]...done
2025-08-09 05:17:09.072 UTC [msp] getPemMaterialFromDir -> DEBU 004 Reading directory /etc/hyperledger/fabric/msp/signcerts
2025-08-09 05:17:09.078 UTC [msp] getPemMaterialFromDir -> DEBU 005 Inspecting file /etc/hyperledger/fabric/msp/signcerts/peer1.org0.example.com-cert.pem
2025-08-09 05:17:09.083 UTC [msp] getPemMaterialFromDir -> DEBU 006 Reading directory /etc/hyperledger/fabric/msp/cacerts
2025-08-09 05:17:09.092 UTC [msp] getPemMaterialFromDir -> DEBU 007 Inspecting file /etc/hyperledger/fabric/msp/cacerts/ca1.org0.example.com-cert.pem
2025-08-09 05:17:09.096 UTC [msp] getPemMaterialFromDir -> DEBU 008 Reading directory /etc/hyperledger/fabric/msp/admincerts
2025-08-09 05:17:09.103 UTC [msp] getPemMaterialFromDir -> DEBU 009 Inspecting file /etc/hyperledger/fabric/msp/admincerts/Admin@org0.example.com-cert.pem
2025-08-09 05:17:09.108 UTC [msp] getPemMaterialFromDir -> DEBU 00a Reading directory /etc/hyperledger/fabric/msp/intermediatecerts
2025-08-09 05:17:09.108 UTC [msp] getMspConfig -> DEBU 00b Intermediate certs folder not found at [/etc/hyperledger/fabric/msp/intermediatecerts]. Skipping. [stat /etc/hyperledger/fabric/msp/intermediatecerts: no such file or directory]
2025-08-09 05:17:09.108 UTC [msp] getPemMaterialFromDir -> DEBU 00c Reading directory /etc/hyperledger/fabric/msp/tlscacerts
2025-08-09 05:17:09.115 UTC [msp] getPemMaterialFromDir -> DEBU 00d Inspecting file /etc/hyperledger/fabric/msp/tlscacerts/tlsca1.org0.example.com-cert.pem
2025-08-09 05:17:09.119 UTC [msp] getPemMaterialFromDir -> DEBU 00e Reading directory /etc/hyperledger/fabric/msp/tlsintermediatecerts
2025-08-09 05:17:09.119 UTC [msp] getMspConfig -> DEBU 00f TLS intermediate certs folder not found at [/etc/hyperledger/fabric/msp/tlsintermediatecerts]. Skipping. [stat /etc/hyperledger/fabric/msp/tlsintermediatecerts: no such file or directory]
2025-08-09 05:17:09.119 UTC [msp] getPemMaterialFromDir -> DEBU 010 Reading directory /etc/hyperledger/fabric/msp/crls
2025-08-09 05:17:09.120 UTC [msp] getMspConfig -> DEBU 011 crls folder not found at [/etc/hyperledger/fabric/msp/crls]. Skipping. [stat /etc/hyperledger/fabric/msp/crls: no such file or directory]
2025-08-09 05:17:09.125 UTC [msp] getMspConfig -> DEBU 012 Loading NodeOUs
2025-08-09 05:17:09.136 UTC [msp] newBccspMsp -> DEBU 013 Creating BCCSP-based MSP instance
2025-08-09 05:17:09.136 UTC [msp] New -> DEBU 014 Creating Cache-MSP instance
2025-08-09 05:17:09.136 UTC [msp] loadLocalMSP -> DEBU 015 Created new local MSP
2025-08-09 05:17:09.137 UTC [msp] Setup -> DEBU 016 Setting up MSP instance org0-example-com
2025-08-09 05:17:09.137 UTC [msp.identity] newIdentity -> DEBU 017 Creating identity instance for cert -----BEGIN CERTIFICATE-----
MIICuTCCAl6gAwIBAgIUN2YiJxE7MQDc54+TTag7AEyVtfswCgYIKoZIzj0EAwIw
cjELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQH
DAdSYWxlaWdoMRkwFwYDVQQKDBBvcmcwLmV4YW1wbGUuY29tMR0wGwYDVQQDDBRj
YTEub3JnMC5leGFtcGxlLmNvbTAeFw0yNTA4MDgxNzM1MTlaFw0zNTA4MDYxNzM1
MTlaMHIxCzAJBgNVBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEQMA4G
A1UEBwwHUmFsZWlnaDEZMBcGA1UECgwQb3JnMC5leGFtcGxlLmNvbTEdMBsGA1UE
AwwUY2ExLm9yZzAuZXhhbXBsZS5jb20wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNC
AATVDfGMpXqB+AFW/H4/gZdFKLIK5ThvZt59412tP06gVgXsB+DgIlFxdINXaJyt
ZpQ9iBDZbaAtWURvsSQVVwgSo4HRMIHOMB0GA1UdDgQWBBSX3w/Uj+iwFWDrisJh
t3iN34axaTAfBgNVHSMEGDAWgBSX3w/Uj+iwFWDrisJht3iN34axaTAPBgNVHRMB
Af8EBTADAQH/MA4GA1UdDwEB/wQEAwIBpjAdBgNVHSUEFjAUBggrBgEFBQcDAQYI
KwYBBQUHAwIwTAYDVR0RBEUwQ4cECv///oIUY2ExLm9yZzAuZXhhbXBsZS5jb22C
FGNhMS1vcmcwLWV4YW1wbGUtY29tgglsb2NhbGhvc3SHBH8AAAEwCgYIKoZIzj0E
AwIDSQAwRgIhAKGmfyznMtv1+w8IN28Uxc9Vq2ETWt2llHiJnr9Bcf61AiEA0ZxT
vEYl6vnAXsclOjGVIxwsQZQDetvpgB6pUAGKNZY=
-----END CERTIFICATE-----
2025-08-09 05:17:09.137 UTC [msp.identity] newIdentity -> DEBU 018 Creating identity instance for cert -----BEGIN CERTIFICATE-----
MIICcDCCAhegAwIBAgIUaPvMfEsh58635Ssgkkl21b7mgfgwCgYIKoZIzj0EAwIw
cjELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQH
DAdSYWxlaWdoMRkwFwYDVQQKDBBvcmcwLmV4YW1wbGUuY29tMR0wGwYDVQQDDBRj
YTEub3JnMC5leGFtcGxlLmNvbTAeFw0yNTA4MDgxNzM1MzRaFw0zNTA1MDgxNzM1
MzRaMGgxCzAJBgNVBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEQMA4G
A1UEBwwHUmFsZWlnaDENMAsGA1UECwwEcGVlcjEfMB0GA1UEAwwWcGVlcjEub3Jn
MC5leGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNxSQwxaIMsw
ysyMgknim9MhKBB25rmg+SDOtyZM9km26ofgp17+pkIBMt8+Q/hfI65+FGKPqvv5
49DzRZGc0iujgZQwgZEwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwUAYD
VR0RBEkwR4cECv///oIWcGVlcjEub3JnMC5leGFtcGxlLmNvbYIWcGVlcjEtb3Jn
MC1leGFtcGxlLWNvbYIJbG9jYWxob3N0hwR/AAABMB8GA1UdIwQYMBaAFJffD9SP
6LAVYOuKwmG3eI3fhrFpMAoGCCqGSM49BAMCA0cAMEQCIHynGWloj5XZUkpnSe1k
Hl5vM74l6Su7yi65cd4/H1zlAiAvL67Ec0Lqbx4jqASSViezoRPpPjRfTLFCojZQ
vHyG8w==
-----END CERTIFICATE-----
2025-08-09 05:17:09.152 UTC [msp.identity] newIdentity -> DEBU 019 Creating identity instance for cert -----BEGIN CERTIFICATE-----
MIICcDCCAhegAwIBAgIUaPvMfEsh58635Ssgkkl21b7mgfgwCgYIKoZIzj0EAwIw
cjELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQH
DAdSYWxlaWdoMRkwFwYDVQQKDBBvcmcwLmV4YW1wbGUuY29tMR0wGwYDVQQDDBRj
YTEub3JnMC5leGFtcGxlLmNvbTAeFw0yNTA4MDgxNzM1MzRaFw0zNTA1MDgxNzM1
MzRaMGgxCzAJBgNVBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEQMA4G
A1UEBwwHUmFsZWlnaDENMAsGA1UECwwEcGVlcjEfMB0GA1UEAwwWcGVlcjEub3Jn
MC5leGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNxSQwxaIMsw
ysyMgknim9MhKBB25rmg+SDOtyZM9km26ofgp17+pkIBMt8+Q/hfI65+FGKPqvv5
49DzRZGc0iujgZQwgZEwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwUAYD
VR0RBEkwR4cECv///oIWcGVlcjEub3JnMC5leGFtcGxlLmNvbYIWcGVlcjEtb3Jn
MC1leGFtcGxlLWNvbYIJbG9jYWxob3N0hwR/AAABMB8GA1UdIwQYMBaAFJffD9SP
6LAVYOuKwmG3eI3fhrFpMAoGCCqGSM49BAMCA0cAMEQCIHynGWloj5XZUkpnSe1k
Hl5vM74l6Su7yi65cd4/H1zlAiAvL67Ec0Lqbx4jqASSViezoRPpPjRfTLFCojZQ
vHyG8w==
-----END CERTIFICATE-----
2025-08-09 05:17:09.152 UTC [msp] setupSigningIdentity -> DEBU 01a Signing identity expires at 2035-05-08 17:35:34 +0000 UTC
2025-08-09 05:17:09.153 UTC [msp.identity] newIdentity -> DEBU 01b Creating identity instance for cert -----BEGIN CERTIFICATE-----
MIICczCCAhigAwIBAgIUaPvMfEsh58635Ssgkkl21b7mgfcwCgYIKoZIzj0EAwIw
cjELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQH
DAdSYWxlaWdoMRkwFwYDVQQKDBBvcmcwLmV4YW1wbGUuY29tMR0wGwYDVQQDDBRj
YTEub3JnMC5leGFtcGxlLmNvbTAeFw0yNTA4MDgxNzM1MjZaFw0zNTA1MDgxNzM1
MjZaMGkxCzAJBgNVBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEQMA4G
A1UEBwwHUmFsZWlnaDEOMAwGA1UECwwFYWRtaW4xHzAdBgNVBAMMFkFkbWluQG9y
ZzAuZXhhbXBsZS5jb20wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAREIjRJFUsO
b0kAbYXOFVpPhjclFtE0dVNWYlnFDVLE7TXUcHObr3HinnviBDJ3e4wKtxeDrE7e
hNhtW2zeK73lo4GUMIGRMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMFAG
A1UdEQRJMEeHBAr///6CFkFkbWluQG9yZzAuZXhhbXBsZS5jb22CFkFkbWluQG9y
ZzAtZXhhbXBsZS1jb22CCWxvY2FsaG9zdIcEfwAAATAfBgNVHSMEGDAWgBSX3w/U
j+iwFWDrisJht3iN34axaTAKBggqhkjOPQQDAgNJADBGAiEA8vr6cgyrFRK4FHbX
KSJ0nKZwi1pukP8m5r7jCcYXjikCIQCbAXytO553FTZSFKr6DldYN7F/uIKmkyBr
tbVVszmn4Q==
-----END CERTIFICATE-----
2025-08-09 05:17:09.154 UTC [msp] hasOURole -> DEBU 01c MSP org0-example-com checking if the identity is a client
2025-08-09 05:17:09.154 UTC [msp] getCertificationChain -> DEBU 01d MSP org0-example-com getting certification chain
2025-08-09 05:17:09.154 UTC [msp] hasOURole -> DEBU 01e MSP org0-example-com checking if the identity is a client
2025-08-09 05:17:09.154 UTC [msp] getCertificationChain -> DEBU 01f MSP org0-example-com getting certification chain
2025-08-09 05:17:09.157 UTC [grpc] InfoDepth -> DEBU 020 [core]parsed scheme: ""
2025-08-09 05:17:09.157 UTC [grpc] InfoDepth -> DEBU 021 [core]scheme "" not registered, fallback to default scheme
2025-08-09 05:17:09.157 UTC [grpc] InfoDepth -> DEBU 022 [core]ccResolverWrapper: sending update to cc: {[{peer1.org0.example.com:7051  <nil> 0 <nil>}] <nil> <nil>}
2025-08-09 05:17:09.157 UTC [grpc] InfoDepth -> DEBU 023 [core]ClientConn switching balancer to "pick_first"
2025-08-09 05:17:09.157 UTC [grpc] InfoDepth -> DEBU 024 [core]Channel switches to new LB policy "pick_first"
2025-08-09 05:17:09.158 UTC [grpc] InfoDepth -> DEBU 025 [core]Subchannel Connectivity change to CONNECTING
2025-08-09 05:17:09.158 UTC [grpc] InfoDepth -> DEBU 026 [core]Subchannel picks a new address "peer1.org0.example.com:7051" to connect
2025-08-09 05:17:09.158 UTC [grpc] InfoDepth -> DEBU 027 [core]pickfirstBalancer: UpdateSubConnState: 0xc0004895c0, {CONNECTING <nil>}
2025-08-09 05:17:09.158 UTC [grpc] InfoDepth -> DEBU 028 [core]Channel Connectivity change to CONNECTING
2025-08-09 05:17:09.161 UTC [comm.tls] ClientHandshake -> DEBU 029 Client TLS handshake completed in 1.530631ms remoteaddress=172.18.0.5:7051
2025-08-09 05:17:09.162 UTC [grpc] InfoDepth -> DEBU 02a [core]Subchannel Connectivity change to READY
2025-08-09 05:17:09.162 UTC [grpc] InfoDepth -> DEBU 02b [core]pickfirstBalancer: UpdateSubConnState: 0xc0004895c0, {READY <nil>}
2025-08-09 05:17:09.162 UTC [grpc] InfoDepth -> DEBU 02c [core]Channel Connectivity change to READY
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 02d [core]parsed scheme: ""
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 02e [core]scheme "" not registered, fallback to default scheme
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 02f [core]ccResolverWrapper: sending update to cc: {[{peer1.org0.example.com:7051  <nil> 0 <nil>}] <nil> <nil>}
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 030 [core]ClientConn switching balancer to "pick_first"
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 031 [core]Channel switches to new LB policy "pick_first"
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 032 [core]Subchannel Connectivity change to CONNECTING
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 033 [core]Subchannel picks a new address "peer1.org0.example.com:7051" to connect
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 034 [core]pickfirstBalancer: UpdateSubConnState: 0xc000119bb0, {CONNECTING <nil>}
2025-08-09 05:17:09.166 UTC [grpc] InfoDepth -> DEBU 035 [core]Channel Connectivity change to CONNECTING
2025-08-09 05:17:09.168 UTC [comm.tls] ClientHandshake -> DEBU 036 Client TLS handshake completed in 1.210041ms remoteaddress=172.18.0.5:7051
2025-08-09 05:17:09.168 UTC [grpc] InfoDepth -> DEBU 037 [core]Subchannel Connectivity change to READY
2025-08-09 05:17:09.168 UTC [grpc] InfoDepth -> DEBU 038 [core]pickfirstBalancer: UpdateSubConnState: 0xc000119bb0, {READY <nil>}
2025-08-09 05:17:09.168 UTC [grpc] InfoDepth -> DEBU 039 [core]Channel Connectivity change to READY
2025-08-09 05:17:09.172 UTC [msp] GetDefaultSigningIdentity -> DEBU 03a Obtaining default signing identity
2025-08-09 05:17:09.172 UTC [msp.identity] Sign -> DEBU 03b Sign: plaintext: 0AB1080A6E08031A0B08D5B3DBC40610...7454656E6465720A075444522D303031      
2025-08-09 05:17:09.172 UTC [msp.identity] Sign -> DEBU 03c Sign: digest: 69759DE696F20EC8C932704E838AA0A9D16C2D34F8AEB713F580CCBB3D23DC6B
Error: error endorsing query: rpc error: code = Unknown desc = Failed evaluating policy on signed data during check policy on channel [tenderchannel] with policy [/Channel/Application/Writers]: [implicit policy evaluation failed - 0 sub-policies were satisfied, but this policy requires 1 of the 'Writers' sub-policies to be satisfied] - proposal response: <nil>
PS D:\InnovaTende007\vars> docker run --rm --network mysite alpine sh -lc "apk add --no-cache openssl >/dev/null && echo | openssl s_client -connect peer1.org0.example.com:7051 -servername peer1.org0.example.com -brief && echo OK_PEER0 || echo FAIL_PEER0 && echo | openssl s_client -connect peer1.org1.example.com:7051 -servername peer1.org1.example.com -brief && echo OK_PEER1 || echo FAIL_PEER1 && echo | openssl s_client -connect orderer1.example.com:7050 -servername orderer1.example.com -brief && echo OK_ORD || echo FAIL_ORD"
Unable to find image 'alpine:latest' locally
latest: Pulling from library/alpine
Digest: sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
Status: Downloaded newer image for alpine:latest
Connecting to 172.18.0.5
depth=0 C=US, ST=North Carolina, L=Raleigh, CN=peer1.org0.example.com
verify error:num=20:unable to get local issuer certificate
depth=0 C=US, ST=North Carolina, L=Raleigh, CN=peer1.org0.example.com
verify error:num=21:unable to verify the first certificate
CONNECTION ESTABLISHED
Protocol version: TLSv1.3
Ciphersuite: TLS_AES_256_GCM_SHA384
Requested Signature Algorithms: RSA-PSS+SHA256:ECDSA+SHA256:ed25519:RSA-PSS+SHA384:RSA-PSS+SHA512:RSA+SHA256:RSA+SHA384:RSA+SHA512:ECDSA+SHA384:ECDSA+SHA512:RSA+SHA1:ECDSA+SHA1
Peer certificate: C=US, ST=North Carolina, L=Raleigh, CN=peer1.org0.example.com
Hash used: SHA256
Signature type: ecdsa_secp256r1_sha256
Verification error: unable to verify the first certificate
Peer Temp Key: X25519, 253 bits
DONE
OK_PEER0
Connecting to 172.18.0.7
depth=0 C=US, ST=North Carolina, L=Raleigh, CN=peer1.org1.example.com
verify error:num=20:unable to get local issuer certificate
depth=0 C=US, ST=North Carolina, L=Raleigh, CN=peer1.org1.example.com
verify error:num=21:unable to verify the first certificate
CONNECTION ESTABLISHED
Protocol version: TLSv1.3
Ciphersuite: TLS_AES_256_GCM_SHA384
Requested Signature Algorithms: RSA-PSS+SHA256:ECDSA+SHA256:ed25519:RSA-PSS+SHA384:RSA-PSS+SHA512:RSA+SHA256:RSA+SHA384:RSA+SHA512:ECDSA+SHA384:ECDSA+SHA512:RSA+SHA1:ECDSA+SHA1
Peer certificate: C=US, ST=North Carolina, L=Raleigh, CN=peer1.org1.example.com
Hash used: SHA256
Signature type: ecdsa_secp256r1_sha256
Verification error: unable to verify the first certificate
Peer Temp Key: X25519, 253 bits
DONE
@OK_PEER1
Connecting to 172.18.0.2
depth=0 C=US, ST=North Carolina, L=Raleigh, CN=orderer1.example.com
verify error:num=20:unable to get local issuer certificate
depth=0 C=US, ST=North Carolina, L=Raleigh, CN=orderer1.example.com
verify error:num=21:unable to verify the first certificate
CONNECTION ESTABLISHED
Protocol version: TLSv1.3
Ciphersuite: TLS_AES_256_GCM_SHA384
Requested Signature Algorithms: RSA-PSS+SHA256:ECDSA+SHA256:ed25519:RSA-PSS+SHA384:RSA-PSS+SHA512:RSA+SHA256:RSA+SHA384:RSA+SHA512:ECDSA+SHA384:ECDSA+SHA512:RSA+SHA1:ECDSA+SHA1
Peer certificate: C=US, ST=North Carolina, L=Raleigh, CN=orderer1.example.com
Hash used: SHA256
Signature type: ecdsa_secp256r1_sha256
Verification error: unable to verify the first certificate
Peer Temp Key: X25519, 253 bits
@DONE
OK_ORD
PS D:\InnovaTende007\vars> docker run --rm --network mysite -v D:\InnovaTende007:/workspace -w /workspace/vars/app/node -e ORG=org0.example.com -e CHANNEL=tenderchannel -e CHAINCODE=tendercc -e WALLET=/workspace/vars/profiles/vscode/wallets/org0.example.com -e CCP=/workspace/vars/app/node/connection.json -e AS_LOCALHOST=false node:14 bash -lc "node -v && npm i --silent && node main.js listBids TDR-001 | cat"                                       
Unable to find image 'node:14' locally
14: Pulling from library/node
0d27a8e86132: Pull complete
6f51ee005dea: Pull complete
d9a8df589451: Pull complete
2ff1d7c41c74: Pull complete
b253aeafeaa7: Pull complete
3d2201bd995c: Pull complete
1de76e268b10: Pull complete
5f32ed3c3f27: Pull complete
0c8cc2f24a4d: Pull complete
Digest: sha256:a158d3b9b4e3fa813fa6c8c590b8f0a860e015ad4e59bbce5744d2f6fd8461aa
Status: Downloaded newer image for node:14
v14.21.3
make: Entering directory '/workspace/vars/app/node/node_modules/pkcs11js/build'
  CXX(target) Release/obj.target/pkcs11/src/main.o
In file included from ../../nan/nan.h:62,
                 from ../src/main.cpp:1:
/root/.cache/node-gyp/14.21.3/include/node/node.h:793:43: warning: cast between incompatible function types from 'void (*)(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE)' {aka 'void (*)(v8::Local<v8::Object>)'} to 'node::addon_register_func' {aka 'void (*)(v8::Local<v8::Object>, v8::Local<v8::Value>, void*)'} [-Wcast-function-type]
       (node::addon_register_func) (regfunc),                          \
                                           ^
/root/.cache/node-gyp/14.21.3/include/node/node.h:827:3: note: in expansion of macro 'NODE_MODULE_X'
   NODE_MODULE_X(modname, regfunc, NULL, 0)  // NOLINT (readability/null_usage)
   ^~~~~~~~~~~~~
../src/main.cpp:27:1: note: in expansion of macro 'NODE_MODULE'
 NODE_MODULE(pkcs11, init)
 ^~~~~~~~~~~
  CXX(target) Release/obj.target/pkcs11/src/dl.o
  CXX(target) Release/obj.target/pkcs11/src/const.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/error.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/v8_convert.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/template.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/mech.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/param.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/param_aes.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/param_rsa.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/param_ecdh.o
  CXX(target) Release/obj.target/pkcs11/src/pkcs11/pkcs11.o
  CXX(target) Release/obj.target/pkcs11/src/async.o
  CXX(target) Release/obj.target/pkcs11/src/node.o
  SOLINK_MODULE(target) Release/obj.target/pkcs11.node
  COPY Release/pkcs11.node
make: Leaving directory '/workspace/vars/app/node/node_modules/pkcs11js/build'
updated 102 packages and audited 102 packages in 74.451s

17 packages are looking for funding
  run `npm fund` for details

found 2 high severity vulnerabilities
  run `npm audit fix` to fix them, or `npm audit` for details
2025-08-09T05:23:15.622Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:23:15.624Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://peer1.org0.example.com:7051 timeout:3000
2025-08-09T05:23:15.626Z - info: [NetworkConfig]: buildPeer - Unable to connect to the endorser peer1.org0.example.com due to Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true       
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7) {
  connectFailed: true
}
2025-08-09T05:23:18.629Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org1.example.com, url:grpcs://peer1.org1.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:23:18.630Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org1.example.com url:grpcs://peer1.org1.example.com:7051 timeout:3000
2025-08-09T05:23:18.630Z - info: [NetworkConfig]: buildPeer - Unable to connect to the endorser peer1.org1.example.com due to Error: Failed to connect before the deadline on Endorser- name: peer1.org1.example.com, url:grpcs://peer1.org1.example.com:7051, connected:false, connectAttempted:true       
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7) {
  connectFailed: true
}
2025-08-09T05:23:21.634Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true
2025-08-09T05:23:21.634Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server orderer1.example.com url:grpcs://orderer1.example.com:7050 timeout:3000
2025-08-09T05:23:21.635Z - info: [NetworkConfig]: buildOrderer - Unable to connect to the committer orderer1.example.com due to Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true        
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7) {
  connectFailed: true
}
2025-08-09T05:23:24.653Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Discoverer- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:23:24.653Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://peer1.org0.example.com:7051 timeout:3000
2025-08-09T05:23:24.653Z - error: [ServiceEndpoint]: ServiceEndpoint grpcs://peer1.org0.example.com:7051 reset connection failed :: Error: Failed to connect before the deadline on Discoverer- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:23:24.653Z - error: [DiscoveryService]: send[tenderchannel] - no discovery results
Error: DiscoveryService has failed to return results
    at DiscoveryService.send (/workspace/vars/app/node/node_modules/fabric-common/lib/DiscoveryService.js:335:10)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async NetworkImpl._initializeInternalChannel (/workspace/vars/app/node/node_modules/fabric-network/lib/network.js:303:13)
    at async NetworkImpl._initialize (/workspace/vars/app/node/node_modules/fabric-network/lib/network.js:253:9)
    at async Gateway.getNetwork (/workspace/vars/app/node/node_modules/fabric-network/lib/gateway.js:355:9)
    at async connectGateway (/workspace/vars/app/node/main.js:62:19)
    at async run (/workspace/vars/app/node/main.js:90:33)
PS D:\InnovaTende007\vars> wsl bash -lc "cd /mnt/d/InnovaTende007 && ./vars/minifab cleanup 2>&1 | sed -n '1,200p'"
Using spec file: /mnt/d/InnovaTende007/spec.yaml
Minifab Execution Context:
    FABRIC_RELEASE=2.5.9
    CHANNEL_NAME=tenderchannel
    PEER_DATABASE_TYPE=couchdb
    CHAINCODE_LANGUAGE=go
    CHAINCODE_NAME=simple
    CHAINCODE_VERSION=1.0
    CHAINCODE_INIT_REQUIRED=true
    CHAINCODE_PARAMETERS="init","a","200","b","300"
    CHAINCODE_PRIVATE=false
    CHAINCODE_POLICY=
    TRANSIENT_DATA=
    BLOCK_NUMBER=newest
    EXPOSE_ENDPOINTS=true
    CURRENT_ORG=org0.example.com
    HOST_ADDRESSES=10.255.255.254,172.20.92.118
    TARGET_ENV=DOCKER
    WORKING_DIRECTORY: /mnt/d/InnovaTende007
.....
# Preparing for the following operations: *********************
  verify options, shutdown network, cleanup working directory
.......
# Running operation: ******************************************
  verify options
.
# Verify the organization option ******************************
  Default option org is org0.example.com which does not exist in your spec, use -o to specify one

# STATS *******************************************************
minifab: ok=17  failed=1

real    0m8.323s
user    0m6.898s
sys     0m1.862s
PS D:\InnovaTende007\vars> docker run --rm --network mysite -v D:\InnovaTende007:/workspace -w /workspace/vars/app/node -e ORG=org0.example.com -e CHANNEL=tenderchannel -e CHAINCODE=tendercc -e WALLET=/workspace/vars/profiles/vscode/wallets/org0.example.com -e CCP=/workspace/vars/app/node/connection.json -e AS_LOCALHOST=false -e DISCOVERY=false node:14 bash -lc "node main.js listBids TDR-001 | cat"
2025-08-09T05:26:51.153Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:26:51.155Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://peer1.org0.example.com:7051 timeout:3000
2025-08-09T05:26:51.159Z - info: [NetworkConfig]: buildPeer - Unable to connect to the endorser peer1.org0.example.com due to Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true       
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7) {
  connectFailed: true
}
2025-08-09T05:26:54.167Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org1.example.com, url:grpcs://peer1.org1.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:26:54.167Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org1.example.com url:grpcs://peer1.org1.example.com:7051 timeout:3000
2025-08-09T05:26:54.167Z - info: [NetworkConfig]: buildPeer - Unable to connect to the endorser peer1.org1.example.com due to Error: Failed to connect before the deadline on Endorser- name: peer1.org1.example.com, url:grpcs://peer1.org1.example.com:7051, connected:false, connectAttempted:true       
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7) {
  connectFailed: true
}
2025-08-09T05:26:57.171Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true
2025-08-09T05:26:57.172Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server orderer1.example.com url:grpcs://orderer1.example.com:7050 timeout:3000
2025-08-09T05:26:57.172Z - info: [NetworkConfig]: buildOrderer - Unable to connect to the committer orderer1.example.com due to Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true        
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7) {
  connectFailed: true
}
2025-08-09T05:26:57.190Z - error: [Endorser]: sendProposal[peer1.org0.example.com] - rejecting with: Error: Broadcast Client peer1.org0.example.com grpcs://peer1.org0.example.com:7051 is not connected
2025-08-09T05:26:57.191Z - error: [SingleQueryHandler]: evaluate: message=Query failed. Errors: ["Error: Broadcast Client peer1.org0.example.com grpcs://peer1.org0.example.com:7051 is not connected"], stack=FabricError: Query failed. Errors: ["Error: Broadcast Client peer1.org0.example.com grpcs://peer1.org0.example.com:7051 is not connected"]
    at SingleQueryHandler.evaluate (/workspace/vars/app/node/node_modules/fabric-network/lib/impl/query/singlequeryhandler.js:70:23)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async Transaction.evaluate (/workspace/vars/app/node/node_modules/fabric-network/lib/transaction.js:322:25)
    at async run (/workspace/vars/app/node/main.js:119:21), name=FabricError
FabricError: Query failed. Errors: ["Error: Broadcast Client peer1.org0.example.com grpcs://peer1.org0.example.com:7051 is not connected"]
    at SingleQueryHandler.evaluate (/workspace/vars/app/node/node_modules/fabric-network/lib/impl/query/singlequeryhandler.js:70:23)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async Transaction.evaluate (/workspace/vars/app/node/node_modules/fabric-network/lib/transaction.js:322:25)
    at async run (/workspace/vars/app/node/main.js:119:21)
PS D:\InnovaTende007\vars> node -e "const fs=require('fs'),p=require('path');const base='D:/InnovaTende007/vars/keyfiles';const tlscaOrg0=fs.readFileSync(p.join(base,'peerOrganizations','org0.example.com','msp','tlscacerts','tlsca1.org0.example.com-cert.pem'),'utf8');const tlscaOrd=fs.readFileSync(p.join(base,'ordererOrganizations','example.com','msp','tlscacerts','tlsca.example.com-cert.pem'),'utf8');const f='D:/InnovaTende007/vars/profiles/org0.example.com/connection.json';let cfg=JSON.parse(fs.readFileSync(f));cfg.peers['peer1.org0.example.com'].tlsCACerts.pem=tlscaOrg0;cfg.orderers['orderer1.example.com'].tlsCACerts.pem=tlscaOrd;fs.writeFileSync(f,JSON.stringify(cfg,null,2));console.log('org0 profile prepared');"                        
org0 profile prepared
PS D:\InnovaTende007\vars> docker run --rm --network mysite -v D:\InnovaTende007:/workspace -w /workspace/vars/app/node -e ORG=org0.example.com -e CHANNEL=tenderchannel -e CHAINCODE=tendercc -e WALLET=/workspace/vars/profiles/vscode/wallets/org0.example.com -e CCP=/workspace/vars/profiles/org0.example.com/connection.json -e AS_LOCALHOST=false -e DISCOVERY=false node:14 bash -lc "node main.js listBids TDR-001 | cat"
2025-08-09T05:28:56.786Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true
2025-08-09T05:28:56.787Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server peer1.org0.example.com url:grpcs://peer1.org0.example.com:7051 timeout:3000
2025-08-09T05:28:56.790Z - info: [NetworkConfig]: buildPeer - Unable to connect to the endorser peer1.org0.example.com due to Error: Failed to connect before the deadline on Endorser- name: peer1.org0.example.com, url:grpcs://peer1.org0.example.com:7051, connected:false, connectAttempted:true       
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7) {
  connectFailed: true
}
2025-08-09T05:28:59.792Z - error: [ServiceEndpoint]: Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true
2025-08-09T05:28:59.792Z - error: [ServiceEndpoint]: waitForReady - Failed to connect to remote gRPC server orderer1.example.com url:grpcs://orderer1.example.com:7050 timeout:3000
2025-08-09T05:28:59.793Z - info: [NetworkConfig]: buildOrderer - Unable to connect to the committer orderer1.example.com due to Error: Failed to connect before the deadline on Committer- name: orderer1.example.com, url:grpcs://orderer1.example.com:7050, connected:false, connectAttempted:true        
    at checkState (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/client.js:77:26)
    at Timeout._onTimeout (/workspace/vars/app/node/node_modules/@grpc/grpc-js/build/src/internal-channel.js:501:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7) {
  connectFailed: true
}
2025-08-09T05:28:59.807Z - error: [Endorser]: sendProposal[peer1.org0.example.com] - rejecting with: Error: Broadcast Client peer1.org0.example.com grpcs://peer1.org0.example.com:7051 is not connected
2025-08-09T05:28:59.808Z - error: [SingleQueryHandler]: evaluate: message=Query failed. Errors: ["Error: Broadcast Client peer1.org0.example.com grpcs://peer1.org0.example.com:7051 is not connected"], stack=FabricError: Query failed. Errors: ["Error: Broadcast Client peer1.org0.example.com grpcs://peer1.org0.example.com:7051 is not connected"]
    at SingleQueryHandler.evaluate (/workspace/vars/app/node/node_modules/fabric-network/lib/impl/query/singlequeryhandler.js:70:23)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async Transaction.evaluate (/workspace/vars/app/node/node_modules/fabric-network/lib/transaction.js:322:25)
    at async run (/workspace/vars/app/node/main.js:119:21), name=FabricError
FabricError: Query failed. Errors: ["Error: Broadcast Client peer1.org0.example.com grpcs://peer1.org0.example.com:7051 is not connected"]
    at SingleQueryHandler.evaluate (/workspace/vars/app/node/node_modules/fabric-network/lib/impl/query/singlequeryhandler.js:70:23)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async Transaction.evaluate (/workspace/vars/app/node/node_modules/fabric-network/lib/transaction.js:322:25)
    at async run (/workspace/vars/app/node/main.js:119:21)
PS D:\InnovaTende007\vars> 