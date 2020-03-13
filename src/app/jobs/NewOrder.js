import Mail from '../../lib/Mail';

class NewOrderMail {
    get key() {
        return 'NewOrderMail';
    }

    async handle({ data }) {
        const {
            existRecipient: recipient,
            existDeliveryman: deliveryman,
        } = data;
        console.log('A fila executou');
        await Mail.sendMail({
            to: `${deliveryman.nome}<${deliveryman.email}`,
            subject: 'Nova encomenda disponível',
            template: 'newOrder',
            context: {
                deliveryman_name: deliveryman.nome,
                client_name: recipient.nome,
                client_address: `Cidade: ${recipient.cidade} Rua: ${recipient.rua} número: ${recipient.numero} `,
            },
        });
    }
}

export default new NewOrderMail();
