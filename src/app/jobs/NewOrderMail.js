import Mail from '../../lib/Mail';

class NewOrderMail {
    get key() {
        return 'NewOrderMail';
    }

    async handle({ data }) {
        const { order } = data;
        console.log('A fila executou');
        await Mail.sendMail({
            to: `${order.deliveryman_id.name}<${order.deliveryman_id.email}`,
            subject: 'Nova encomenda disponível',
            template: 'newOrder',
            context: {
                deliveryman_name: order.deliveryman_id.nome,
                client_product: order.product,
            },
        });
    }
}

export default new NewOrderMail();
