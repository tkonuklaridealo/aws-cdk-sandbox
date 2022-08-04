import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {FederatedPrincipal, ManagedPolicy, Role} from "aws-cdk-lib/aws-iam";

export class GithubStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new Role(this, 'github-deployment-role', {
            assumedBy: new FederatedPrincipal(
                `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
                {
                    'StringLike': {
                        'token.actions.githubusercontent.com:sub': `repo:aws-cdk-sandbox:*`
                    }
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
            roleName: 'GithubDeploymentRole'
        })
    }
}
